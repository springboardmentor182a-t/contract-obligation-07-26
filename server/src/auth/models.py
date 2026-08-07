from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: Optional[str] = None
    full_name: Optional[str] = None
    email: str
    password: str
    confirm_password: Optional[str] = None

class UserCreate(BaseModel):
    full_name: Optional[str] = None
    name: Optional[str] = None
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class VerifyOtpRequest(BaseModel):
    email: str
    otp: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp: Optional[str] = None
    new_password: Optional[str] = None
    password: Optional[str] = None
