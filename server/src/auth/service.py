import logging

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from src.audit.service import create_audit_log
from src.auth.jwt import create_access_token
from src.auth.models import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    ResetTokenRequest,
)
from src.auth.reset import (
    ResetEmailError,
    ResetTokenError,
    create_password_reset_token,
    decode_password_reset_token,
    reset_token_matches_password,
    send_password_reset_email,
)
from src.auth.security import hash_password, verify_password
from src.database.models import UserModel


logger = logging.getLogger(__name__)
GENERIC_RESET_RESPONSE = (
    "If an account exists for this email, a password reset link has been sent."
)
INVALID_RESET_TOKEN_MESSAGE = (
    "This password reset link is invalid or has expired."
)


class AuthService:
    """Authentication business logic."""

    def register(
        self,
        request: RegisterRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()

        if request.role != "Employee":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Public registration is limited to Employee accounts.",
            )

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
        except IntegrityError:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )
        except Exception:
            db.rollback()

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Unable to create the account.",
            )

        create_audit_log(
            db=db,
            user_id=new_user.id,
            event_type="create",
            action="User registered",
            module="Authentication",
            description=f"{new_user.email} created a new account",
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

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account is inactive.",
            )

        database_role = user.role

        if not database_role or request.role != database_role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="The selected role does not match this account.",
            )

        access_token = create_access_token(
            {
                "sub": str(user.id),
                "email": user.email,
                "role": database_role,
            }
        )

        create_audit_log(
            db=db,
            user_id=user.id,
            event_type="security",
            action="User logged in",
            module="Authentication",
            description=f"{user.email} logged in successfully",
        )

        display_name = (
            user.full_name
            or user.name
            or user.email
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "role": database_role,
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

        if user is not None and user.is_active:
            reset_token = create_password_reset_token(
                user_id=user.id,
                password_hash=user.password,
            )
            email_accepted = False
            try:
                send_password_reset_email(user.email, reset_token)
                email_accepted = True
            except ResetEmailError:
                logger.warning(
                    "Password reset email was not accepted by SMTP."
                )

            try:
                create_audit_log(
                    db=db,
                    user_id=user.id,
                    event_type="security",
                    action="Password reset requested",
                    module="Authentication",
                    description=(
                        "Password reset email accepted by SMTP."
                        if email_accepted
                        else "Password reset email delivery unavailable."
                    ),
                )
            except Exception:
                db.rollback()
                logger.warning("Password reset audit event could not be stored.")

        return {"message": GENERIC_RESET_RESPONSE}

    def _get_reset_user(
        self,
        token: str,
        db: Session,
        lock: bool = False,
    ):
        try:
            token_data = decode_password_reset_token(token)
        except ResetTokenError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=INVALID_RESET_TOKEN_MESSAGE,
            )

        query = db.query(UserModel).filter(
            UserModel.id == token_data.user_id
        )
        if lock:
            query = query.with_for_update()
        user = query.first()

        if (
            user is None
            or not user.is_active
            or not reset_token_matches_password(token_data, user.password)
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=INVALID_RESET_TOKEN_MESSAGE,
            )

        return user

    def validate_reset_token(
        self,
        request: ResetTokenRequest,
        db: Session,
    ):
        self._get_reset_user(request.token, db)
        return {"valid": True}

    def reset_password(
        self,
        request: ResetPasswordRequest,
        db: Session,
    ):
        user = self._get_reset_user(request.token, db, lock=True)

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

        try:
            create_audit_log(
                db=db,
                user_id=user.id,
                event_type="security",
                action="Password reset",
                module="Authentication",
                description="Password reset completed.",
            )
        except Exception:
            db.rollback()
            logger.warning("Password reset audit event could not be stored.")

        return {
            "message": "Password reset successfully."
        }
