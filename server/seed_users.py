import sys
import os

# Ensure the script can import from src/
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.database.core import SessionLocal
from src.users.models import User
from src.auth.service import AuthService

def seed_users():
    print("Starting database seeding for Auth Module...")
    db = SessionLocal()
    auth_service = AuthService()

    test_users = [
        {
            "name": "Admin User", 
            "email": "admin@contractiq.com", 
            "password": "adminpassword", 
            "role": "Admin", 
            "is_active": 1
        },
        {
            "name": "Jane Manager", 
            "email": "jane@contractiq.com", 
            "password": "password123", 
            "role": "Manager", 
            "is_active": 1
        },
        {
            "name": "John Standard", 
            "email": "john@contractiq.com", 
            "password": "password123", 
            "role": "User", 
            "is_active": 1
        },
    ]

    for user_data in test_users:
        existing_user = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing_user:
            hashed = auth_service.get_password_hash(user_data["password"])
            new_user = User(
                name=user_data["name"],
                email=user_data["email"],
                hashed_password=hashed,
                role=user_data["role"],
                is_active=user_data["is_active"]
            )
            db.add(new_user)
            print(f" [+] Created {user_data['role']}: {user_data['email']}")
        else:
            print(f" [!] User already exists: {user_data['email']}")

    db.commit()
    db.close()
    print("Seeding complete!")

if __name__ == "__main__":
    seed_users()
