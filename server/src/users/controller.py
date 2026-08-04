from typing import List, Optional
import secrets
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.future import select

from src.database.core import get_db
from src.database.models import User, UserInvitation
from .schemas import (
    UserResponse,
    UserInviteRequest,
    UserInviteResponse,
    UserUpdateRequest,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    result = db.execute(select(User))
    users = result.scalars().all()

    return [
        UserResponse(
            id=u.id,
            full_name=u.full_name,
            email=u.email,
            role=u.role,
            department=u.department or "",
            status=u.status,
            lastActive="Just now",
        )
        for u in users
    ]


@router.post("/invite", response_model=UserInviteResponse)
def invite_user(
    payload: UserInviteRequest,
    db: Session = Depends(get_db),
):
    # Check if user already exists
    result = db.execute(
        select(User).where(User.email == payload.email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    # Create invitation
    new_invitation = UserInvitation(
        email=payload.email,
        role=payload.role,
        department=payload.department,
        message=payload.message,
        status="Active",
    )

    db.add(new_invitation)

    # Create user so it appears immediately in the User Table
    temp_password = secrets.token_hex(16)

    new_user = User(
        name=payload.full_name,
        full_name=payload.full_name,
        email=payload.email,
        password=temp_password,
        role=payload.role,
        department=payload.department,
        status="Active",
        is_active=True,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_invitation)
    db.refresh(new_user)

    return UserInviteResponse(
        id=new_invitation.id,
        email=new_invitation.email,
        role=new_invitation.role,
        department=new_invitation.department or "",
        status=new_invitation.status,
        invitedAt=new_invitation.created_at.isoformat(),
    )


@router.get("/invitations", response_model=List[UserInviteResponse])
def list_invitations(db: Session = Depends(get_db)):
    result = db.execute(
        select(UserInvitation).order_by(UserInvitation.created_at.desc())
    )
    invitations = result.scalars().all()

    return [
        UserInviteResponse(
            id=inv.id,
            email=inv.email,
            role=inv.role,
            department=inv.department or "",
            status=inv.status,
            invitedAt=inv.created_at.isoformat(),
        )
        for inv in invitations
    ]


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: UserUpdateRequest,
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    user.full_name = payload.full_name
    user.name = payload.full_name
    user.email = payload.email
    user.role = payload.role
    user.department = payload.department
    user.status = payload.status

    db.commit()
    db.refresh(user)

    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        department=user.department or "",
        status=user.status,
        lastActive="Just now",
    )


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }