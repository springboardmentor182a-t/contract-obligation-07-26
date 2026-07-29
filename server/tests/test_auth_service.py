from src.auth.service import authenticate_user
from src.auth.models import UserLogin

def test_authenticate_user_success():
    creds = UserLogin(email="admin@contractiq.com", password="password123")
    token = authenticate_user(creds)
    assert token is not None
    assert token.access_token == "simulated_jwt_token_12345"
    assert token.token_type == "bearer"