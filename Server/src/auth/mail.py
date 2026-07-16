from fastapi_mail import ConnectionConfig, FastMail, MessageSchema

from core.config import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.EMAIL_HOST_USER,
    MAIL_PASSWORD=settings.EMAIL_HOST_PASSWORD,
    MAIL_FROM=settings.EMAIL_HOST_USER,
    MAIL_PORT=settings.EMAIL_PORT,
    MAIL_SERVER=settings.EMAIL_HOST,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)


async def send_otp(full_name: str, user_email: str, otp: str):
    message = MessageSchema(
        subject="Your Password Reset OTP",
        recipients=[user_email],
        body=f"""
        Dear {full_name},

        We received a request to reset your password.

        OTP: {otp}

        This OTP is valid for the next 15 minutes.

        Regards,
        QUICK HIRE
        """,
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
