from pydantic import BaseModel
<<<<<<< HEAD


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
=======
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: Optional[str] = None
    email: str
    password: str
>>>>>>> e4b4e4e0c29f6c8156d879c7524be11fe270caa9
