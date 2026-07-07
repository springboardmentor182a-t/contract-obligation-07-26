import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response
from sqlalchemy.orm import Session

from auth.service import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
)
from database.core import get_db, SessionLocal
from entities.user import User
from core.config import settings
from auth.models import (
    UserResponse,
    UserLogin,
    ChangePassword,
    UserCreate,
    UserUpdate,
    Token,
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post("/register", response_model=UserResponse)
def register_user(
    user_data: UserCreate,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        user = User(
            role=user_data.role,
            full_name=user_data.full_name,
            email=user_data.email,
            phone=user_data.phone,
            password=hash_password(user_data.password),
            employee_id=user_data.employee_id,
            company_name=user_data.company_name,
            department=user_data.department,
            designation=user_data.designation,
            location=user_data.location,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    return user


@router.get("/user/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")
    return user


@router.post("/login", response_model=Token)
def login_user(request: UserLogin, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=404, detail="User not exist!!")

    token = create_access_token(
        {"sub": user.email, "user_id": user.user_id, "role": user.role}
    )

    return {"access_token": token, "token_type": "bearer"}


@router.put("/change_password", response_model=UserResponse)
def change_password(
    request: ChangePassword,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == payload.get("user_id")).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    if not verify_password(request.old_password, user.password):
        raise HTTPException(status_code=404, detail="User not exist!!")

    user.password = hash_password(request.new_password)

    db.commit()
    db.refresh(user)

    return user


@router.get("/profile", response_model=UserResponse)
def get_profile(payload: dict = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload["sub"]).first()
    return user



@router.put("/update_user", response_model=UserResponse)
def update_user(
    user_data: UserResponse,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")
    
    user.role = user_data.role
    user.full_name = user_data.full_name
    user.email = user_data.email
    user.phone = user_data.phone
    user.employee_id = user_data.employee_id
    user.company_name = user_data.company_name
    user.department = user_data.department
    user.designation = user_data.designation
    user.location = user_data.location

    db.commit()
    db.refresh(user)

    return user



@router.get("/logout")
def logout_user(response: Response):
    response.delete_cookie("access_token")

    return {"message": "Logout successful"}
