import os
import uuid
import requests

from fastapi import APIRouter, Depends ,  Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.auth.models import (
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    VerifyOTPRequest,
    TokenResponse,
)
from src.auth.service import AuthService
from src.auth.security import hash_password
from src.auth.jwt import create_access_token
from src.auth.dependencies import get_current_user
from src.database.core import get_db
from src.database.models import UserModel


class CompleteProfileRequest(BaseModel):
    role: str


router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_service = AuthService()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/login", response_model=TokenResponse)
async def login(
    request: Request,
    db: Session = Depends(get_db),
):
    content_type = request.headers.get("content-type", "").lower()

    if "application/x-www-form-urlencoded" in content_type:
        form_data = await request.form()

        email = form_data.get("username")
        password = form_data.get("password")

    else:
        body = await request.json()

        email = body.get("email") or body.get("username")
        password = body.get("password")

    login_request = LoginRequest(
        email=email,
        password=password,
    )

    return auth_service.login(login_request, db)


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


@router.post("/verify-otp")
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    return auth_service.verify_otp(request, db)


@router.post("/reset-password")
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db),
):
    return auth_service.reset_password(request, db)


# Google OAuth
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/api/auth/google/callback"


@router.get("/google/login")
def google_login():
    auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        "&scope=email%20profile"
        "&prompt=select_account"
    )

    return RedirectResponse(url=auth_url)


@router.get("/google/callback")
def google_callback(
    code: str = None,
    db: Session = Depends(get_db),
):
    if not code:
        return {"error": "No authorization code provided by Google"}

    token_url = "https://oauth2.googleapis.com/token"

    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI,
    }

    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")

    if not access_token:
        return {"error": "Failed to retrieve access token from Google"}

    user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"

    user_info = requests.get(
        user_info_url,
        headers={"Authorization": f"Bearer {access_token}"},
    ).json()

    email = user_info.get("email")

    if not email:
        return {"error": "Unable to retrieve email from Google"}

    mail_username = email.split("@")[0]

    user = (
        db.query(UserModel)
        .filter(UserModel.email == email)
        .first()
    )

    if not user:
        user = UserModel(
            name=mail_username,
            full_name=mail_username,
            email=email,
            password=hash_password(str(uuid.uuid4())),
            role="Employee",
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    else:
        user.name = mail_username
        user.full_name = mail_username
        db.commit()

    jwt_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )

    return RedirectResponse(
        url=(
            f"http://localhost:3000/auth/callback"
            f"?token={jwt_token}"
            f"&role={user.role}"
            f"&name={user.name}"
        )
    )