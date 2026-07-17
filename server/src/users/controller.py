from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy.future import select
# from pydantic import BaseModel, ConfigDict, EmailStr
# from typing import Optional, List
# from src.database.core import get_db
# from pydantic import ConfigDict
from datetime import datetime
from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
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



# class UserResponse(BaseModel):
#         ...
#     model_config = ConfigDict(from_attributes=True)

@router.get("", response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).order_by(User.id.asc()))
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
async def invite_user(
    payload: UserInviteRequest,
    db: AsyncSession = Depends(get_db),
):
    # Create invitation
    new_invitation = UserInvitation(
        email=payload.email,
        role=payload.role,
        department=payload.department,
        message=payload.message,
        status="Pending",
    )

    db.add(new_invitation)

    # Check if user already exists
    result = await db.execute(
        select(User).where(User.email == payload.email)
    )
    existing_user = result.scalar_one_or_none()

    # Create user only if it doesn't exist
    if not existing_user:
        new_user = User(
        full_name=payload.full_name,
        email=payload.email,
        role=payload.role,
        department=payload.department,
        status="Active",
    )
        db.add(new_user)

    await db.commit()
    await db.refresh(new_invitation)

    return UserInviteResponse(
        id=new_invitation.id,
        email=new_invitation.email,
        role=new_invitation.role,
        department=new_invitation.department or "N/A",
        status=new_invitation.status,
        invitedAt=new_invitation.created_at.isoformat(),
    )
@router.get("/invitations", response_model=List[UserInviteResponse])
async def list_invitations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserInvitation).order_by(UserInvitation.created_at.desc()))
    invitations = result.scalars().all()
    
    return [
        UserInviteResponse(
            id=inv.id,
            email=inv.email,
            role=inv.role,
            department=inv.department or "N/A",
            status=inv.status,
            invitedAt=inv.created_at.isoformat()
        )
        for inv in invitations
    ]
@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    payload: UserUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.full_name = payload.full_name
    user.email = payload.email
    user.role = payload.role
    user.department = payload.department
    user.status = payload.status

    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        department=user.department,
        status=user.status,
        lastActive="Just now",
    )

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    await db.delete(user)
    await db.commit()

    return {"message": "User deleted successfully"}