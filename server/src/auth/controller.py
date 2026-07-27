from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
import secrets
import uuid

from src.database.core import get_db
from src.users.service import UserService
from src.auth.service import AuthService
from src.users.models import User
from src.auth.models import SignupRequest, LoginRequest
from src.utils.email import send_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])
user_service = UserService()
auth_service = AuthService()

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

@router.get("/health")
def health():
    return {"status": "ok"}

@router.post("/login", response_model=Token)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = user_service.get_user_by_email(db, email=req.email)
    if not user or not auth_service.verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth_service.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/signup", status_code=201)
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # We will use the user_service to create the user, but for now we fallback to auth_service if needed.
    # We will just implement a basic signup logic since the user expects it
    existing_user = user_service.get_user_by_email(db, email=data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth_service.get_password_hash(data.password)
    user_data = User(email=data.email, name=data.name, hashed_password=hashed_password, role=data.role, is_active=1)
    db.add(user_data)
    db.commit()
    db.refresh(user_data)
    return {"message": "User created successfully", "user": {"email": user_data.email}}

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = user_service.get_user_by_email(db, email=req.email)
    if not user:
        return {"message": "If your email is registered, you will receive a password reset link."}
    
    reset_token = str(uuid.uuid4())
    user.reset_token = reset_token
    db.commit()

    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    success, extra = send_reset_email(user.email, reset_link)

    if success:
        if extra:
            return {"message": "Email sent! (Test Mode)", "preview_url": extra}
        return {"message": "Password reset link sent to your email."}
    else:
        raise HTTPException(status_code=500, detail="Failed to send email.")

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.reset_token == req.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    hashed_password = auth_service.get_password_hash(req.new_password)
    user.hashed_password = hashed_password
    user.reset_token = None
    db.commit()

    return {"message": "Password has been reset successfully"}
