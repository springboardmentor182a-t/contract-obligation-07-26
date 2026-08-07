from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    confirm_password: str

class ResetPasswordRequest(BaseModel):
    email: str
