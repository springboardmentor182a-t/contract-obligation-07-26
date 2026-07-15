from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response
from sqlalchemy.orm import Session
import random
from sqlalchemy.exc import IntegrityError

from database.core import get_db, SessionLocal
from entities.user import User
from entities.otp import OTP
from core.config import settings
from audit_logs.service import create_audit_log
from auth.mail import send_otp
from auth.service import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
)
from auth.models import (
    UserResponse,
    UserLogin,
    UserCreate,
    Token,
    ChangePassword,
    VerifyOTPRequest,
    NewPassword,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register_user(
    user_data: UserCreate,
    response: Response,
    db: Session = Depends(get_db),
):
    user = User(
        role=user_data.role,
        full_name=user_data.full_name,
        email=user_data.email,
        phone=user_data.phone,
        password=hash_password(user_data.password),
        employee_id=user_data.employee_id,
        organization_id=user_data.organization_id,
        company_name=user_data.company_name,
        department=user_data.department,
        designation=user_data.designation,
        location=user_data.location,
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=str(e.orig)  # ya "Email already exists"
        )

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        action="register user",
        status="success",
        module="Authentication",
        description="register new user.",
    )

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
        create_audit_log(
            db=db,
            user_id=user.user_id,
            user_name=user.full_name,
            action="change password",
            status="warning!!",
            module="Authentication",
            description="User your login password.but Incorect password!!",
        )
        raise HTTPException(status_code=404, detail="Incorect password!!")

    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        status="success",
        action="LOGIN",
        module="Authentication",
        description="User logged in successfully",
    )

    token = create_access_token(
        {"sub": user.email, "user_id": user.user_id, "role": user.role}
    )

    return {"access_token": token, "token_type": "bearer"}


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

    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        status="success",
        action="update profile",
        module="update",
        description="User update your profile details.",
    )

    return user


@router.get("/logout")
def logout_user(response: Response):
    response.delete_cookie("access_token")

    return {"message": "Logout successful"}


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
        create_audit_log(
            db=db,
            user_id=user.user_id,
            user_name=user.full_name,
            action="change password",
            status="warning",
            module="Authentication",
            description="User change your login password.but incorrect old password!!",
        )
        raise HTTPException(status_code=404, detail="incorrect old password!!")

    user.password = hash_password(request.new_password)

    db.commit()
    db.refresh(user)

    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        action="change password",
        status="success",
        module="Authentication",
        description="User change your login password.",
    )

    return user


@router.post("/forget_password")
async def change_password(
    email: str,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    generatedOTP = random.randint(100000, 999999)
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    otp_data = OTP(email=user.email, otp=generatedOTP, expires_at=expires_at)

    db.add(otp_data)
    db.commit()
    await send_otp(user.full_name, user.email, otp=generatedOTP)
    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        action="send otp",
        status="success",
        module="Authentication",
        description="OTP has been sent to your registered email.",
    )

    return {"success": True, "message": "OTP has been sent to your registered email."}


@router.post("/verify_otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):

    record = (
        db.query(OTP).filter(OTP.email == request.email).order_by(OTP.id.desc()).first()
    )

    if not record:
        raise HTTPException(404, "OTP not found")

    if datetime.utcnow() > record.expires_at:
        raise HTTPException(400, "OTP expired")

    if int(record.otp) != int(request.otp):
        raise HTTPException(400, "Invalid OTP")

    record.is_verified = True

    db.commit()
    db.refresh(record)

    return {"message": "OTP verified successfully"}


@router.put("/new_password", response_model=UserResponse)
def change_password(
    request: NewPassword,
    db: Session = Depends(get_db),
):
    record = (
        db.query(OTP).filter(OTP.email == request.email).order_by(OTP.id.desc()).first()
    )

    if not record:
        raise HTTPException(status_code=404, detail="OTP record not found.")

    if not record.is_verified:
        raise HTTPException(
            status_code=400,
            detail="OTP verification is required before resetting your password.",
        )

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        action="reset password",
        status="success",
        module="Authentication",
        description="reset login password.",
    )

    user.password = hash_password(request.new_password)
    record.is_verified = False

    db.commit()
    db.refresh(user)

    return user
