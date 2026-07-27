from pydantic import BaseModel
from typing import Optional

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
    role: str = "User"
