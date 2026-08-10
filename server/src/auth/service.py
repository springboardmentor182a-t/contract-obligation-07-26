from src.database.models import User
from src.auth.models import LoginRequest, SignupRequest
import uuid
import hashlib
from datetime import datetime

def hash_password(password: str) -> str:
    """Standard SHA-256 hash for secure password storage"""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def login_user(data: LoginRequest, db):
<<<<<<< HEAD
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
=======
    """
    Authenticate user against the PostgreSQL database.
    Verifies user existence and password hash.
    """
    if not data.email or not data.password:
        return None
        
    email_clean = data.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    
    if not user:
        return None
        
    # Check password hash
    if user.password_hash:
        input_hash = hash_password(data.password)
        if user.password_hash != input_hash:
            return None
    else:
        # If user existed without password_hash (e.g. legacy seed), set password hash now
        user.password_hash = hash_password(data.password)
        
    # Update last login timestamp
    user.lastLogin = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    db.commit()
    db.refresh(user)
    
    token = f"jwt-session-{uuid.uuid4().hex}"
    return {
        "token": token,
        "access_token": token,
        "user": {
            "id": user.id,
            "user_id": user.user_id,
            "email": user.email,
            "name": user.name or email_clean.split('@')[0].capitalize(),
            "role": user.role or "User",
            "status": user.status or "Active"
        }
    }
>>>>>>> origin/main-group-B


def signup_user(data: SignupRequest, db):
<<<<<<< HEAD
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
=======
    """
    Register or request access for a user in the PostgreSQL database.
    Stores password hash and initializes user notifications.
    """
    email_clean = data.email.strip().lower()
    existing_user = db.query(User).filter(User.email == email_clean).first()
    
    if existing_user:
        # Update existing user's password and details
        existing_user.password_hash = hash_password(data.password)
        if data.name:
            existing_user.name = data.name.strip()
        existing_user.status = "Active"
        existing_user.lastLogin = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        db.commit()
        db.refresh(existing_user)
        user = existing_user
    else:
        # Create brand new user in PostgreSQL
        user = User(
            user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
            name=data.name.strip() if data.name else email_clean.split('@')[0].capitalize(),
            email=email_clean,
            password_hash=hash_password(data.password),
            role="User",
            status="Active",
            lastLogin=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
    token = f"jwt-session-{uuid.uuid4().hex}"
    return {
        "token": token,
        "access_token": token,
        "user": {
            "id": user.id,
            "user_id": user.user_id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        },
        "message": "Account created and access granted successfully."
    }
>>>>>>> origin/main-group-B
