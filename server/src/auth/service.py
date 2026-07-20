from sqlalchemy.orm import Session
from passlib.context import CryptContext

from src.entities.user import User
from src.auth.models import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def register_user(db: Session, data: RegisterRequest):
    existing_user = db.query(User).filter(User.email == data.email).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered",
        }

    hashed_password = pwd_context.hash(data.password)

    user = User(
        full_name=data.full_name,
        email=data.email,
        password=hashed_password,
        role=data.role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "success": True,
        "message": "User registered successfully",
    }


def login_user(db: Session, data: LoginRequest):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password",
        }

    if not pwd_context.verify(data.password, user.password):
        return {
            "success": False,
            "message": "Invalid email or password",
        }

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
        },
    }


def forgot_password_user(data: ForgotPasswordRequest):
    """
    Demo implementation.
    Replace this with email sending logic later.
    """

    return {
        "success": True,
        "message": f"Password reset link sent to {data.email}",
    }