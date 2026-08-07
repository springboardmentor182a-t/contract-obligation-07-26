from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import User, UserSession
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.auth.models import LoginRequest, SignupRequest, ResetPasswordRequest
from src.utils.email import send_reset_email
from src.auth.service import login_user, signup_user
from pydantic import BaseModel
from passlib.context import CryptContext
import jwt
import uuid
from datetime import datetime, timedelta

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "super-secret-key-for-contractiq"
ALGORITHM = "HS256"

class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/signup")
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name}

@router.post("/login")
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    
    # Try to verify hash (will fail for old placeholder accounts)
    try:
        is_valid = pwd_context.verify(user_data.password, user.hashed_password) if user else False
    except ValueError:
        # Happens if we try to verify the old '_hashed' plaintext
        is_valid = False
        
    if not user or not is_valid:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token_expires = timedelta(minutes=30)
    expire = datetime.utcnow() + access_token_expires
    to_encode = {"sub": user.email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    session_token = str(uuid.uuid4())
    session_expire = datetime.utcnow() + timedelta(days=7)
    
    new_session = UserSession(
        user_id=user.id,
        session_token=session_token,
        expires_at=session_expire
    )
    db.add(new_session)
    db.commit()
    
    return {
        "access_token": encoded_jwt,
        "refresh_token": session_token,
        "token_type": "bearer", 
        "user": {"id": user.id, "email": user.email, "full_name": user.full_name}
    }

@router.post("/logout")
def logout():
    # In a real app we would read the token and set is_active=False in the db
    return {"message": "Successfully logged out"}
def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(data, db)
    if result:
        return result
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/demo-login")
def demo_login(db: Session = Depends(get_db)):
    from src.database.models import User, Contract, Obligation, Renewal
    from datetime import date, timedelta
    
    # Create or retrieve Demo User
    demo_email = "demo@contractiq.com"
    demo_user = db.query(User).filter(User.email == demo_email).first()
    if not demo_user:
        demo_user = User(
            user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
            name="Demo User",
            email=demo_email,
            role="Admin",
            status="Active",
            lastLogin="Just now"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Clean existing data for demo environment reset
    db.query(Renewal).delete()
    db.query(Obligation).delete()
    db.query(Contract).delete()

    # Insert 6 realistic mock contracts
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
    
    # Add obligations
    obligations = [
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Quarterly True-up Report", dueDate=base_date + timedelta(days=15), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Annual Security Audit", dueDate=base_date + timedelta(days=90), status="Pending", priority="Medium"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[2].id, description="Deliverable 1 Approval", dueDate=base_date + timedelta(days=5), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[3].id, description="First Payment Milestone", dueDate=base_date + timedelta(days=30), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[5].id, description="Joint Marketing Plan", dueDate=base_date + timedelta(days=45), status="Pending", priority="Low"),
    ]
    db.add_all(obligations)
    db.commit()

    return {
        "token": "demo-jwt-token-99999", 
        "user": {"email": demo_user.email, "name": demo_user.name},
        "message": "Demo environment provisioned successfully"
    }

@router.post("/register", status_code=201)
def register(data: SignupRequest, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed_password = pwd_context.hash(data.password)
    new_user = User(
        full_name=data.name or data.email.split('@')[0],
        email=data.email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=30)
    expire = datetime.utcnow() + access_token_expires
    to_encode = {"sub": new_user.email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return {
        "access_token": encoded_jwt,
        "token_type": "bearer",
        "user": {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name},
        "message": "User created successfully"
    }

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully", "status": "success"}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    reset_token = str(uuid.uuid4())
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    
    try:
        success, extra = send_reset_email(data.email, reset_link)
        if success:
            if extra:
                return {"message": "Email sent! (Test Mode)", "preview_url": extra, "reset_link": reset_link}
            return {"message": "Password reset link sent to your email.", "reset_link": reset_link}
    except Exception as e:
        # If email fails (e.g. no internet or smtp), just return the link anyway for demo purposes
        pass

    return {"message": "Password reset link generated (mocked).", "reset_link": reset_link}
