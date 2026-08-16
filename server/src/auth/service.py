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
    VerifyOTPRequest,
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
from src.database.models import UserModel, OrganizationModel


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
            organization_id=request.organization_id,
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

        if not database_role:
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
            import random
            from datetime import datetime, timedelta, timezone
            
            # Generate 6-digit OTP
            otp = f"{random.randint(0, 999999):06d}"
            user.reset_otp = otp
            user.reset_otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
            db.commit()
            
            # Send email using SMTP
            import smtplib
            import os
            from email.mime.text import MIMEText
            from email.mime.multipart import MIMEMultipart
            
            # Use dotenv if available, otherwise rely on os.environ
            try:
                from dotenv import load_dotenv
                load_dotenv()
            except ImportError:
                pass
            
            smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com").strip('"').strip("'")
            smtp_port = int(os.getenv("EMAIL_PORT", 587))
            smtp_user = os.getenv("SMTP_USER", "").strip('"').strip("'")
            smtp_password = os.getenv("SMTP_PASSWORD", "").strip('"').strip("'")
            
            if smtp_user and smtp_password:
                msg = MIMEMultipart()
                msg["From"] = smtp_user
                msg["To"] = user.email
                msg["Subject"] = "Password Reset OTP - ContractIQ"
                
                body = f"Hello,\n\nYour OTP for password reset is: {otp}\n\nThis OTP is valid for 15 minutes.\n\nThank you,\nContractIQ Team"
                msg.attach(MIMEText(body, "plain"))
                
                try:
                    server = smtplib.SMTP(smtp_host, smtp_port)
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.send_message(msg)
                    server.quit()
                    logger.info(f"OTP email sent successfully to {user.email}")
                except Exception as e:
                    logger.error(f"Failed to send OTP email to {user.email}: {e}")
            else:
                logger.error("SMTP_USER or SMTP_PASSWORD not set. Cannot send OTP email.")

            try:
                create_audit_log(
                    db=db,
                    user_id=user.id,
                    event_type="security",
                    action="Password reset requested",
                    module="Authentication",
                    description="Password reset OTP generated and sent.",
                )
            except Exception:
                db.rollback()
                logger.warning("Password reset audit event could not be stored.")

        return {"message": GENERIC_RESET_RESPONSE}

    def verify_otp(
        self,
        request: VerifyOTPRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()
        user = db.query(UserModel).filter(UserModel.email == email).first()

        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)

        if not user or not user.is_active or not user.reset_otp or user.reset_otp != request.otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP.",
            )
            
        if user.reset_otp_expires_at is None or user.reset_otp_expires_at.replace(tzinfo=timezone.utc) < now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired.",
            )

        return {"message": "OTP verified successfully."}

    def reset_password(
        self,
        request: ResetPasswordRequest,
        db: Session,
    ):
        email = str(request.email).strip().lower()
        user = db.query(UserModel).filter(UserModel.email == email).first()

        from datetime import datetime, timezone
        now = datetime.now(timezone.utc)

        if not user or not user.is_active or not user.reset_otp or user.reset_otp != request.otp:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid OTP.",
            )
            
        if user.reset_otp_expires_at is None or user.reset_otp_expires_at.replace(tzinfo=timezone.utc) < now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP has expired.",
            )

        if len(request.new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must contain at least 8 characters.",
            )

        user.password = hash_password(request.new_password)
        user.reset_otp = None
        user.reset_otp_expires_at = None

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
                action="Password reset completed",
                module="Authentication",
                description="User password successfully reset via OTP.",
            )
        except Exception:
            db.rollback()
            logger.warning("Password reset audit event could not be stored.")

        return {
            "message": "Password reset successfully. You can now log in."
        }
