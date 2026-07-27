from .models import UserCreate, UserResponse, UserManagementCreate
from typing import Optional
from sqlalchemy.orm import Session
from src.database.core import SessionLocal
from src.database.models import User
from datetime import date, datetime


def create_user(user_data: UserCreate) -> UserResponse:
    # Placeholder for database insertion logic
    return UserResponse(
        id=1, 
        email=user_data.email, 
        name=user_data.name, 
        is_active=True
    )

def get_user_by_id(user_id: int) -> Optional[UserResponse]:
    # Placeholder for database retrieval logic
    if user_id == 1:
        return UserResponse(
            id=1, 
            email="admin@contractiq.com", 
            name="Spandana Doe", 
            is_active=True
        )
    return None

def get_all_users():
    db: Session = SessionLocal()
    try:
        return db.query(User).all()
    finally:
        db.close()


def get_user_by_id_db(user_id: int):
    db: Session = SessionLocal()
    try:
        return db.query(User).filter(User.id == user_id).first()
    finally:
        db.close()

def create_user_db(user_data: UserManagementCreate):
    db: Session = SessionLocal()

    try:
        new_user = User(
            email=user_data.email,
            name=user_data.name,
            hashed_password="",
            is_active=True,

            department=user_data.department,
            role=user_data.role,
            status=user_data.status,

            phone="",
            date_joined=date.today(),
            last_login=datetime.now()
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    finally:
        db.close()

def update_user_db(user_id: int, user_data: UserManagementCreate):
    db: Session = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return None

        user.email = user_data.email
        user.name = user_data.name
        user.department = user_data.department
        user.role = user_data.role
        user.status = user_data.status
        user.phone = user_data.phone
        user.date_joined = user_data.date_joined
        user.last_login = user_data.last_login

        db.commit()
        db.refresh(user)

        return user

    finally:
        db.close()

def delete_user_db(user_id: int):
    db: Session = SessionLocal()

    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            return False

        db.delete(user)
        db.commit()

        return True

    finally:
        db.close()
        db.close()
