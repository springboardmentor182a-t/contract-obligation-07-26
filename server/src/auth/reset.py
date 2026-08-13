import hashlib
import hmac
import os
import secrets
import smtplib
import ssl
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from urllib.parse import urlencode

from jose import JWTError, jwt

from src.auth.jwt import ALGORITHM, SECRET_KEY


RESET_TOKEN_TYPE = "password_reset"
DEFAULT_RESET_TOKEN_EXPIRE_MINUTES = 15


class ResetTokenError(Exception):
    """Raised when a password-reset token cannot be trusted."""


class ResetEmailError(Exception):
    """Raised when a password-reset email is not accepted by SMTP."""


@dataclass(frozen=True)
class ResetTokenData:
    user_id: int
    password_state: str


def get_reset_token_expire_minutes() -> int:
    raw_value = os.getenv(
        "RESET_TOKEN_EXPIRE_MINUTES",
        str(DEFAULT_RESET_TOKEN_EXPIRE_MINUTES),
    )
    try:
        value = int(raw_value)
    except (TypeError, ValueError):
        return DEFAULT_RESET_TOKEN_EXPIRE_MINUTES
    return value if value > 0 else DEFAULT_RESET_TOKEN_EXPIRE_MINUTES


def _password_state(password_hash: str) -> str:
    return hmac.new(
        SECRET_KEY.encode("utf-8"),
        f"{RESET_TOKEN_TYPE}:{password_hash}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def create_password_reset_token(user_id: int, password_hash: str) -> str:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=get_reset_token_expire_minutes())
    payload = {
        "sub": str(user_id),
        "type": RESET_TOKEN_TYPE,
        "jti": secrets.token_urlsafe(24),
        "password_state": _password_state(password_hash),
        "iat": now,
        "exp": expires_at,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_password_reset_token(token: str) -> ResetTokenData:
    if not token:
        raise ResetTokenError("Missing reset token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != RESET_TOKEN_TYPE:
            raise ResetTokenError("Invalid reset token type")
        user_id = int(payload.get("sub", 0))
        password_state = str(payload.get("password_state", ""))
    except (JWTError, TypeError, ValueError) as exc:
        raise ResetTokenError("Invalid reset token") from exc

    if user_id <= 0 or not password_state:
        raise ResetTokenError("Invalid reset token claims")

    return ResetTokenData(
        user_id=user_id,
        password_state=password_state,
    )


def reset_token_matches_password(
    token_data: ResetTokenData,
    password_hash: str,
) -> bool:
    expected_state = _password_state(password_hash)
    return hmac.compare_digest(token_data.password_state, expected_state)


def smtp_configuration_available() -> bool:
    return all(
        os.getenv(name)
        for name in (
            "SMTP_HOST",
            "SMTP_USER",
            "SMTP_PASSWORD",
            "FRONTEND_URL",
        )
    )


def _smtp_port() -> int:
    try:
        return int(os.getenv("SMTP_PORT", "587"))
    except (TypeError, ValueError) as exc:
        raise ResetEmailError("SMTP configuration is invalid") from exc


def send_password_reset_email(recipient: str, token: str) -> None:
    if not smtp_configuration_available():
        raise ResetEmailError("SMTP configuration is incomplete")

    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_password = os.getenv("SMTP_PASSWORD", "")
    frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")
    smtp_port = _smtp_port()
    reset_url = (
        f"{frontend_url}/reset-password?"
        f"{urlencode({'token': token})}"
    )
    expiry_minutes = get_reset_token_expire_minutes()

    message = EmailMessage()
    message["Subject"] = "Reset your ContractIQ password"
    message["From"] = smtp_user
    message["To"] = recipient
    message.set_content(
        "A password reset was requested for your ContractIQ account.\n\n"
        "Use the secure link below to create a new password.\n\n"
        f"{reset_url}\n\n"
        f"The link expires after {expiry_minutes} minutes.\n\n"
        "If you did not request this password reset, you can ignore this "
        "email."
    )

    try:
        if smtp_port == 465:
            with smtplib.SMTP_SSL(
                smtp_host,
                smtp_port,
                timeout=15,
                context=ssl.create_default_context(),
            ) as smtp:
                smtp.login(smtp_user, smtp_password)
                refused = smtp.send_message(message)
        else:
            with smtplib.SMTP(smtp_host, smtp_port, timeout=15) as smtp:
                smtp.ehlo()
                smtp.starttls(context=ssl.create_default_context())
                smtp.ehlo()
                smtp.login(smtp_user, smtp_password)
                refused = smtp.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise ResetEmailError("Password reset email was not accepted") from exc

    if refused:
        raise ResetEmailError("Password reset email recipient was refused")
