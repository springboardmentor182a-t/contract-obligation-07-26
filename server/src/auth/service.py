<<<<<<< HEAD
class AuthService:
    """Business logic for authentication. Depends on domain entities only."""

    def login(self, email: str, password: str) -> str:
        return "stub-token"
=======
from src.database.core import mock_db
from src.auth.models import LoginRequest, SignupRequest

def login_user(data: LoginRequest):
    if data.email and data.password:
        return {"token": "mock-jwt-token-12345", "user": {"email": data.email}}
    return None

def signup_user(data: SignupRequest):
    mock_db["users"].append({"email": data.email})
    return {"token": "mock-jwt-token-67890", "message": "User created successfully"}
>>>>>>> e4b4e4e0c29f6c8156d879c7524be11fe270caa9
