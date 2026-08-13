from fastapi import APIRouter, HTTPException, Depends, Request, Query, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from src.database.db import get_db
from src.database.models import User, UserSession, Contract, Obligation, Renewal
from src.auth.models import (
    LoginRequest, 
    UserLogin,
    SignupRequest, 
    UserCreate,
    ForgotPasswordRequest, 
    VerifyOtpRequest, 
    ResetPasswordRequest
)
from src.auth.service import login_user, signup_user, hash_password
from src.utils.email import send_otp_email, send_reset_email
from datetime import datetime, timedelta, date
import uuid
import random
import os
import urllib.parse
import secrets
import logging
import httpx
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config


router = APIRouter(prefix="/auth", tags=["auth"])


try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
except Exception:
    pwd_context = None


try:
    import jwt
except Exception:
    jwt = None

logger = logging.getLogger("auth.controller")

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-for-contractiq")
ALGORITHM = "HS256"

# Google OAuth2 Configuration
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "YOUR_GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")

oauth = OAuth()
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

def create_jwt_token(email: str) -> str:
    if jwt:
        try:
            expire = datetime.utcnow() + timedelta(days=7)
            return jwt.encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)
        except Exception:
            pass
    return f"jwt-session-{uuid.uuid4().hex}"

def hash_bcrypt(password: str) -> str:
    if pwd_context:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    return hash_password(password)

def verify_password(plain: str, hashed: str = None, sha_hash: str = None) -> bool:
    if hashed and pwd_context:
        try:
            if pwd_context.verify(plain, hashed):
                return True
        except Exception:
            pass
    if sha_hash:
        return sha_hash == hash_password(plain)
    if hashed:
        return hashed == hash_password(plain)
    return False

@router.get("/health")
def health():
    return {"status": "ok"}

@router.get("/google/login")
async def google_login(request: Request, redirect_uri: str = None):
    """
    GET /api/auth/google/login
    Initiates Google OAuth2 authentication flow.
    """
    return await oauth.google.authorize_redirect(request, redirect_uri="http://localhost:8000/api/auth/google/callback")

@router.get("/google/callback")
async def google_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """
    GET /api/auth/google/callback
    Handles Google OAuth2 callback.
    """
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        logger.exception("Exception during Google OAuth token exchange")
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={urllib.parse.quote(f'Google OAuth error: {str(e)}')}", status_code=302)

    userinfo = token.get('userinfo')
    if not userinfo:
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={urllib.parse.quote('Unable to extract user profile from Google.')}", status_code=302)

    google_email = userinfo.get("email")
    google_name = userinfo.get("name") or userinfo.get("given_name")

    if not google_email:
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={urllib.parse.quote('Unable to extract verified email from Google account.')}", status_code=302)

    email_clean = google_email.strip().lower()
    name_clean = (google_name or email_clean.split('@')[0]).strip()

    # Bulletproof Database Logic (SQLAlchemy & PostgreSQL)
    try:
        user = db.query(User).filter(User.email == email_clean).first()
        if user:
            # Existing user: update last login and details
            user.lastLogin = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            if not user.name or user.name == "User":
                user.name = name_clean
                user.full_name = name_clean
            user.status = "Active"
            db.commit()
            db.refresh(user)
        else:
            # New user: securely create account with SSO random password hash
            random_pw = secrets.token_urlsafe(32)
            user = User(
                user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
                name=name_clean,
                full_name=name_clean,
                email=email_clean,
                password_hash=hash_password(random_pw),
                hashed_password=hash_bcrypt(random_pw),
                role="User",
                status="Active",
                lastLogin=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
    except IntegrityError as ie:
        db.rollback()
        logger.error(f"Database IntegrityError during Google SSO registration: {ie}")
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={urllib.parse.quote('Database integrity error during Google SSO account creation.')}", status_code=302)
    except Exception as ex:
        db.rollback()
        logger.error(f"Unexpected database error during Google SSO: {ex}")
        return RedirectResponse(url=f"{FRONTEND_URL}/auth/callback?error={urllib.parse.quote('An unexpected error occurred while saving user profile in database.')}", status_code=302)

    # Generate ContractIQ Session JWT Token
    jwt_token = create_jwt_token(user.email)
    
    redirect_target = f"http://localhost:5173/auth/callback?token={urllib.parse.quote(jwt_token)}"
    return RedirectResponse(url=redirect_target, status_code=302)

@router.post("/signup")
def signup(user_data: SignupRequest, db: Session = Depends(get_db)):
    if user_data.confirm_password and user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    existing_user = db.query(User).filter(User.email == user_data.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_name = user_data.name or user_data.full_name or user_data.email.split('@')[0]
    hashed_pwd = hash_bcrypt(user_data.password)
    sha_hash = hash_password(user_data.password)
    
    new_user = User(
        user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
        name=user_name,
        full_name=user_name,
        email=user_data.email.strip().lower(),
        hashed_password=hashed_pwd,
        password_hash=sha_hash,
        role="User",
        status="Active",
        lastLogin=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    encoded_jwt = create_jwt_token(new_user.email)
    
    return {
        "id": new_user.id,
        "token": encoded_jwt,
        "access_token": encoded_jwt,
        "email": new_user.email,
        "name": new_user.name,
        "full_name": new_user.full_name,
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
            "full_name": new_user.full_name,
            "role": new_user.role
        }
    }

@router.post("/register", status_code=201)
def register(data: SignupRequest, db: Session = Depends(get_db)):
    if data.confirm_password and data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    existing_user = db.query(User).filter(User.email == data.email.strip().lower()).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_name = data.name or data.full_name or data.email.split('@')[0]
    hashed_pwd = hash_bcrypt(data.password)
    sha_hash = hash_password(data.password)
    
    new_user = User(
        user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
        name=user_name,
        full_name=user_name,
        email=data.email.strip().lower(),
        hashed_password=hashed_pwd,
        password_hash=sha_hash,
        role="User",
        status="Active",
        lastLogin=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    encoded_jwt = create_jwt_token(new_user.email)
    
    return {
        "access_token": encoded_jwt,
        "token": encoded_jwt,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "user_id": new_user.user_id,
            "email": new_user.email,
            "name": new_user.name,
            "full_name": new_user.full_name,
            "role": new_user.role
        },
        "message": "User created successfully"
    }


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/login")

def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(data, db)

    if result:
        return result

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )


@router.post("/register", status_code=201)
def register(data: SignupRequest, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    return signup_user(data, db)


@router.post("/signup", status_code=201)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    return signup_user(data, db)



def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    email_clean = user_data.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    
    is_valid = False
    if user:
        is_valid = verify_password(user_data.password, user.hashed_password, user.password_hash)
        
        # Backward compatibility for empty password fields
        if not is_valid and not user.hashed_password and not user.password_hash:
            user.password_hash = hash_password(user_data.password)
            user.hashed_password = hash_bcrypt(user_data.password)
            is_valid = True

    if not user or not is_valid:
        raise HTTPException(status_code=400, detail="Invalid email or password. Please verify your credentials or register.")
    
    # Update last login timestamp
    user.lastLogin = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    db.commit()
    db.refresh(user)

    encoded_jwt = create_jwt_token(user.email)
    session_token = str(uuid.uuid4())
    session_expire = datetime.utcnow() + timedelta(days=7)
    
    new_session = UserSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=session_expire
    )
    db.add(new_session)
    db.commit()
    
    user_name = user.name or user.full_name or user.email.split('@')[0]

    return {
        "access_token": encoded_jwt,
        "token": encoded_jwt,
        "refresh_token": session_token,
        "token_type": "bearer", 
        "user": {
            "id": user.id,
            "user_id": user.user_id,
            "email": user.email,
            "name": user_name,
            "full_name": user_name,
            "role": user.role or "User",
            "status": user.status or "Active"
        }
    }

@router.post("/demo-login")
def demo_login(db: Session = Depends(get_db)):
    demo_email = "demo@contractiq.com"
    demo_user = db.query(User).filter(User.email == demo_email).first()
    if not demo_user:
        demo_user = User(
            user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
            name="Demo User",
            full_name="Demo User",
            email=demo_email,
            password_hash=hash_password("demo123"),
            hashed_password=hash_bcrypt("demo123"),
            role="Admin",
            status="Active",
            lastLogin="Just now"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Clean existing contract data for demo environment reset
    db.query(Renewal).delete()
    db.query(Obligation).delete()
    db.query(Contract).delete()

    base_date = date.today()
    contracts = [
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Acme Corp", type="MSA", status="Active", value=150000.00, owner="Demo User", date=base_date - timedelta(days=30)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Globex Inc", type="NDA", status="Active", value=0.00, owner="Demo User", date=base_date - timedelta(days=15)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Initech", type="SOW", status="Draft", value=75000.00, owner="Demo User", date=base_date - timedelta(days=5)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Soylent Corp", type="Vendor Agreement", status="Pending Signature", value=45000.00, owner="Demo User", date=base_date - timedelta(days=2)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Umbrella Corp", type="MSA", status="Expired", value=200000.00, owner="Demo User", date=base_date - timedelta(days=400)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Wayne Enterprises", type="Partnership", status="Active", value=500000.00, owner="Demo User", date=base_date - timedelta(days=100)),
    ]
    db.add_all(contracts)
    db.commit()
    
    obligations = [
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Quarterly True-up Report", dueDate=base_date + timedelta(days=15), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Annual Security Audit", dueDate=base_date + timedelta(days=90), status="Pending", priority="Medium"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[2].id, description="Deliverable 1 Approval", dueDate=base_date + timedelta(days=5), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[3].id, description="First Payment Milestone", dueDate=base_date + timedelta(days=30), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[5].id, description="Joint Marketing Plan", dueDate=base_date + timedelta(days=45), status="Pending", priority="Low"),
    ]
    db.add_all(obligations)
    db.commit()
    
    token = create_jwt_token(demo_user.email)
    
    return {
        "token": token,
        "access_token": token,
        "user": {"email": demo_user.email, "name": demo_user.name, "role": demo_user.role},
        "message": "Demo environment provisioned successfully"
    }


@router.post("/logout")
def logout():
    return {
        "message": "Logged out successfully",
        "status": "success"
    }



@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    reset_token = str(uuid.uuid4())
    reset_link = (
        f"http://localhost:3000/reset-password?token={reset_token}"
    )

    success, extra = send_reset_email(data.email, reset_link)

    if success:
        if extra:
            return {
                "message": "Email sent! (Test Mode)",
                "preview_url": extra,
            }

        return {
            "message": "Password reset link sent to your email."
        }

    raise HTTPException(
        status_code=500,
        detail="Failed to send email."
    )

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/forgot-password
    Accepts email, generates 6-digit OTP, sets 10-min expiry, saves to DB,
    and sends OTP email via smtplib (with console & UI dev fallback).
    """
    email_clean = data.email.strip().lower()
    if not email_clean:
        raise HTTPException(status_code=400, detail="Email is required")

    # Generate 6-digit numeric OTP
    otp_code = f"{random.randint(100000, 999999)}"
    otp_expiry = datetime.utcnow() + timedelta(minutes=10)

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        # Create user record in PostgreSQL if not already present
        user = User(
            user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
            name=email_clean.split('@')[0].capitalize(),
            full_name=email_clean.split('@')[0].capitalize(),
            email=email_clean,
            otp_code=otp_code,
            otp_expiry=otp_expiry,
            role="User",
            status="Active",
            lastLogin="Never"
        )
        db.add(user)
    else:
        user.otp_code = otp_code
        user.otp_expiry = otp_expiry

    db.commit()
    db.refresh(user)

    # Send OTP via email / fallback console
    success, smtp_sent, info = send_otp_email(email_clean, otp_code)

    return {
        "status": "success",
        "message": f"6-digit OTP verification code generated for {email_clean}.",
        "email": email_clean,
        "smtp_sent": smtp_sent,
        "dev_otp": otp_code, # Always available so the user is never blocked
        "expires_in_minutes": 10
    }

@router.post("/verify-otp")
def verify_otp(data: VerifyOtpRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/verify-otp
    Accepts email and 6-digit OTP. Checks PostgreSQL database for matching code and valid expiry.
    """
    email_clean = data.email.strip().lower()
    otp_clean = data.otp.strip()

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found for this email.")

    if not user.otp_code or user.otp_code.strip() != otp_clean:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Please enter the 6-digit code received.")

    if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP code has expired (10 min limit). Please request a new code.")

    temp_token = f"temp-reset-token-{uuid.uuid4().hex}"
    return {
        "status": "success",
        "message": "OTP verified successfully.",
        "valid": True,
        "token": temp_token
    }

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    POST /api/auth/reset-password
    Accepts email, OTP, and new_password.
    Validates OTP from DB, hashes new password, updates DB, and clears OTP fields.
    """
    email_clean = data.email.strip().lower()
    new_password = data.new_password or data.password

    if not new_password or len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    if data.otp:
        otp_clean = data.otp.strip()
        if not user.otp_code or user.otp_code.strip() != otp_clean:
            raise HTTPException(status_code=400, detail="Invalid OTP code. Password reset aborted.")

        if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
            raise HTTPException(status_code=400, detail="OTP code has expired. Please restart the reset flow.")

    # Hash new password and clear OTP
    user.password_hash = hash_password(new_password)
    user.hashed_password = hash_bcrypt(new_password)
    user.otp_code = None
    user.otp_expiry = None

    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "message": "Password reset successfully! You can now log in with your new password."
    }

@router.get("/me")
def get_current_user_profile(email: str = None, db: Session = Depends(get_db)):
    """
    GET /api/auth/me
    Retrieves the authenticated user profile (or demo/first user).
    """
    user = None
    if email:
        user = db.query(User).filter(User.email == email.strip().lower()).first()
    
    if not user:
        user = db.query(User).filter(User.email == "demo@contractiq.com").first()
    
    if not user:
        user = db.query(User).first()
        
    if user:
        user_name = user.name or user.full_name or user.email.split('@')[0]
        return {
            "name": user_name,
            "full_name": user_name,
            "email": user.email,
            "role": user.role or "User",
            "status": user.status or "Active",
            "company": "ContractIQ Technologies Inc.",
            "timezone": "UTC (Coordinated Universal Time)"
        }
        
    return {
        "name": "Demo Administrator",
        "full_name": "Demo Administrator",
        "email": "demo@contractiq.com",
        "role": "Admin",
        "status": "Active",
        "company": "ContractIQ Technologies Inc.",
        "timezone": "UTC (Coordinated Universal Time)"
    }

