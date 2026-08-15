from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse
import uuid
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.auth.security import hash_password
from src.auth.jwt import create_access_token
from src.database.models import UserModel
from src.auth.dependencies import get_current_user
import os


class CompleteProfileRequest(BaseModel):
    role: str

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


# Load real credentials
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8000/api/auth/google/callback"

@router.get("/google/login")
def google_login():
    # Uses the real Client ID and forces the account chooser
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?client_id={GOOGLE_CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=email%20profile&prompt=select_account"
    return RedirectResponse(url=auth_url)

@router.get("/google/callback")
def google_callback(code: str = None, db: Session = Depends(get_db)):
    if not code:
        return {"error": "No authorization code provided by Google"}
    
    # 1. Exchange the code for a real Google Access Token
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "code": code,
        "grant_type": "authorization_code",
        "redirect_uri": REDIRECT_URI
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    
    if not access_token:
        return {"error": "Failed to retrieve access token from Google"}

    # 2. Fetch the user's real email from Google
    user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
    user_info = requests.get(user_info_url, headers={"Authorization": f"Bearer {access_token}"}).json()
    
    email = user_info.get("email")
    mail_username = email.split("@")[0] # Extracts everything before the @ symbol
    
    # 3. Save or update the user in the database
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        user = UserModel(
            name=mail_username,
            full_name=mail_username,
            email=email,
            password=hash_password(str(uuid.uuid4())),
            role="Employee",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.name = mail_username
        user.full_name = mail_username
        db.commit()
        
    # 4. Generate ContractIQ JWT and redirect to the frontend (Port 3000)
    jwt_token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )
    
    # Redirects back to your React frontend running on port 3000
    return RedirectResponse(url=f"http://localhost:3000/auth/callback?token={jwt_token}&role={user.role}&name={user.name}")

