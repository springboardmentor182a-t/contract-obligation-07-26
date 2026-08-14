from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
import uuid
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.auth.security import hash_password
from src.auth.jwt import create_access_token
from src.database.models import UserModel
from src.auth.dependencies import get_current_user

class CompleteProfileRequest(BaseModel):
    role: str

from src.auth.models import (
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ResetTokenRequest,
    TokenResponse,
)
from src.auth.service import AuthService
from src.database.core import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_service = AuthService()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/login", response_model=TokenResponse)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    return auth_service.login(request, db)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    return auth_service.register(request, db)


@router.post("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db),
):
    return auth_service.forgot_password(request, db)


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    return auth_service.reset_password(request, db)


@router.post("/reset-password/validate")
def validate_reset_password_token(
    request: ResetTokenRequest,
    db: Session = Depends(get_db),
):
    return auth_service.validate_reset_token(request, db)

@router.get("/google/callback")
def google_callback(email: str, name: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    is_new_user = False
    if not user:
        is_new_user = True
        user = UserModel(
            name=name,
            full_name=name,
            email=email,
            password=hash_password(str(uuid.uuid4())),
            role=None,
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    jwt_token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role or "",
    })

    return RedirectResponse(url=f"http://localhost:3000/auth/callback?token={jwt_token}&isNewUser={str(is_new_user).lower()}")

@router.put("/complete-profile")
def complete_profile(request: CompleteProfileRequest, db: Session = Depends(get_db), current_user: UserModel = Depends(get_current_user)):
    current_user.role = request.role
    db.commit()
    return {"message": "Profile updated successfully"}
