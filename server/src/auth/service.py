from src.database.models import User
from src.auth.models import LoginRequest, SignupRequest
import uuid


def login_user(data: LoginRequest, db):
    if data.email and data.password:
        user = db.query(User).filter(User.email == data.email).first()
        name = user.name if user else data.email.split("@")[0]

        return {
            "token": "mock-jwt-token-12345",
            "user": {
                "email": data.email,
                "name": name,
            },
        }
    return None


def signup_user(data: SignupRequest, db):
    new_user = User(
        user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
        name=data.name or data.email.split("@")[0],
        email=data.email,
        role="User",
        status="Active",
        lastLogin="Never",
    )

    db.add(new_user)
    db.commit()

    return {
        "token": "mock-jwt-token-67890",
        "message": "User created successfully",
    }