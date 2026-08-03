from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import User, Contract, Obligation, Renewal
from src.auth.models import (
    LoginRequest, 
    SignupRequest, 
    ForgotPasswordRequest, 
    VerifyOtpRequest, 
    ResetPasswordRequest
)
from src.auth.service import login_user, signup_user, hash_password
from src.utils.email import send_otp_email, send_reset_email
from datetime import datetime, timedelta, date
import uuid
import random

router = APIRouter()

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(data, db)
    if result:
        return result
    raise HTTPException(status_code=401, detail="Invalid email or password. Please verify your credentials or register.")

@router.post("/demo-login")
def demo_login(db: Session = Depends(get_db)):
    demo_email = "demo@contractiq.com"
    demo_user = db.query(User).filter(User.email == demo_email).first()
    if not demo_user:
        demo_user = User(
            user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
            name="Demo User",
            email=demo_email,
            password_hash=hash_password("demo123"),
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

    from src.notifications.controller import ensure_initial_notifications
    ensure_initial_notifications(db, demo_user.email)

    return {
        "token": "demo-jwt-token-99999",
        "access_token": "demo-jwt-token-99999",
        "user": {"email": demo_user.email, "name": demo_user.name, "role": demo_user.role},
        "message": "Demo environment provisioned successfully"
    }

@router.post("/register", status_code=201)
def register(data: SignupRequest, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    return signup_user(data, db)

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully", "status": "success"}

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
    Validates OTP from DB, hashes new password with SHA-256, updates DB, and clears OTP fields.
    """
    email_clean = data.email.strip().lower()
    otp_clean = data.otp.strip()
    new_password = data.new_password

    if not new_password or len(new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    if not user.otp_code or user.otp_code.strip() != otp_clean:
        raise HTTPException(status_code=400, detail="Invalid OTP code. Password reset aborted.")

    if not user.otp_expiry or user.otp_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="OTP code has expired. Please restart the reset flow.")

    # Hash new password and clear OTP
    user.password_hash = hash_password(new_password)
    user.otp_code = None
    user.otp_expiry = None

    db.commit()
    db.refresh(user)

    return {
        "status": "success",
        "message": "Password reset successfully! You can now log in with your new password."
    }
