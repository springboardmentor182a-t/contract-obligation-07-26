from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from src.auth.jwt import create_access_token
from src.auth.models import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
)
from src.auth.security import hash_password, verify_password
from src.database.models import UserModel


class AuthService:
    """Authentication business logic."""

    def register(
        self,
        request: RegisterRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()

        existing_user = (
            db.query(UserModel)
            .filter(UserModel.email == email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )

        new_user = UserModel(
            name=request.name.strip(),
            full_name=request.name.strip(),
            email=email,
            password=hash_password(request.password),
            role=request.role,
            organization=request.organization.strip(),
            department=request.department.strip(),
            phone=request.phone.strip(),
            is_active=True,
        )

        try:
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
        except Exception:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to create the account.",
            )

        return {
            "message": "User registered successfully",
            "user_id": new_user.id,
            "email": new_user.email,
            "role": new_user.role,
        }

    def login(
        self,
        request: LoginRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()

        user = (
            db.query(UserModel)
            .filter(UserModel.email == email)
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is inactive.",
            )

        try:
            password_is_valid = verify_password(
                request.password,
                user.password,
            )
        except Exception:
            password_is_valid = False

        if not password_is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        access_token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
                "role": user.role or "Employee",
            }
        )

        display_name = (
            user.full_name
            or user.name
            or user.email
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": user.role or "Employee",
            "name": display_name,
        }

    def forgot_password(
        self,
        request: ForgotPasswordRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()

        user = (
            db.query(UserModel)
            .filter(UserModel.email == email)
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account was found with this email.",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is inactive.",
            )

        return {
            "message": (
                "Email verified. You can continue to reset your password."
            )
        }

    def reset_password(
        self,
        request: ResetPasswordRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()

        user = (
            db.query(UserModel)
            .filter(UserModel.email == email)
            .first()
        )

        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account was found with this email.",
            )

        if len(request.new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least 8 characters.",
            )

        user.password = hash_password(request.new_password)

        try:
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to reset the password.",
            )

        return {
            "message": "Password reset successfully."
        }