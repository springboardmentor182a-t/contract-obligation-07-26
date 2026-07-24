from fastapi import APIRouter, HTTPException
from src.auth.models import LoginRequest, SignupRequest
from src.auth.service import login_user, signup_user
from pydantic import BaseModel
import uuid
from src.utils.email import send_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


class ResetPasswordRequest(BaseModel):
    email: str


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/login")
def login(data: LoginRequest):
    result = login_user(data)
    if result:
        return result
    raise HTTPException(status_code=400, detail="Invalid credentials")


@router.post("/signup", status_code=201)
def signup(data: SignupRequest):
    return signup_user(data)


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    reset_token = str(uuid.uuid4())
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"

    success, extra = send_reset_email(data.email, reset_link)

    if success:
        if extra:
            return {
                "message": "Email sent! (Test Mode)",
                "preview_url": extra,
            }
        return {"message": "Password reset link sent to your email."}

    raise HTTPException(
        status_code=500,
        detail="Failed to send email."
    )