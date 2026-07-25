from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from entities.user import UserRole
from database.core import get_db
from entities.user import User
from audit_logs.service import create_audit_log
from auth.service import verify_token
from auth.models import UserResponse, UserUpdate
from users.service import admin_required

router = APIRouter(
    prefix="/user",
    tags=["Users"],
)


@router.get("/user/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")
    return user


@router.get("/users")
def get_users(
    current_user: User = Depends(admin_required), db: Session = Depends(get_db)
):
    users = db.query(User).all()

    return users


@router.put("/update_user", response_model=UserResponse)
def update_user(
    user_data: UserUpdate,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    user.role = user_data.role
    user.full_name = user_data.full_name
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
        action="update user",
        status="success",
        module="Users",
        description="User update successfully.by admin",
    )

    return user


@router.put("/deactivate_user/{user_id}", response_model=UserResponse)
def deactivate_user(
    user_id: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    user.is_active = not user.is_active

    db.commit()
    db.refresh(user)
    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        action="user activity",
        status="success",
        module="Users",
        description=f"deactivate_user : {user.is_active} .by admin",
    )

    return user


@router.delete("/delete_user/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    db.delete(user)
    db.commit()

    create_audit_log(
        db=db,
        user_id=user.user_id,
        user_name=user.full_name,
        action="change password",
        status="success",
        module="Users",
        description="User deleted successfully.by admin",
    )

    return {"message": "User deleted successfully"}
