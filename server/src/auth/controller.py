from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.models import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
)

from src.auth.service import (
    register_user,
    login_user,
    forgot_password_user,
)

from src.database.core import SessionLocal

router = APIRouter(prefix="/auth", tags=["Authentication"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(db, data)


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(db, data)


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    return forgot_password_user(data)