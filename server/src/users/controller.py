from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from src.database.core import get_db
from src.database.models import UserInvitation, User

router = APIRouter(prefix="/users", tags=["Users"])

class UserInviteRequest(BaseModel):
    email: EmailStr
    role: str
    department: Optional[str] = ""
    message: Optional[str] = ""

class UserInviteResponse(BaseModel):
    id: int
    email: str
    role: str
    department: str
    status: str
    invitedAt: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    status: str
    lastActive: str

    class Config:
        orm_mode = True

@router.get("", response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = db.execute(select(User).where(User.id == 1))
    user = result.scalar_one_or_none()
    
    return [
        UserResponse(
            id=u.id,
            name=u.full_name,
            email=u.email,
            role=u.role,
            status="Active",
            lastActive="Just now"
        )
        for u in users
    ]

@router.post("/invite", response_model=UserInviteResponse)
async def invite_user(payload: UserInviteRequest, db: AsyncSession = Depends(get_db)):
    # TODO: Connect API Endpoint here
    # Sends an invitation link to the recipient via Email (SendGrid / Twilio Send API)
    # INSERTS a row into "user_invitations" table
    
    new_invitation = UserInvitation(
        email=payload.email,
        role=payload.role,
        department=payload.department,
        message=payload.message,
        status="Pending"
    )
    db.add(new_invitation)
    await db.commit()
    await db.refresh(new_invitation)
    
    return UserInviteResponse(
        id=new_invitation.id,
        email=new_invitation.email,
        role=new_invitation.role,
        department=new_invitation.department or "N/A",
        status=new_invitation.status,
        invitedAt=datetime.now().isoformat()
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
