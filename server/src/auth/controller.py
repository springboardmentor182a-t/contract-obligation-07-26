from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
