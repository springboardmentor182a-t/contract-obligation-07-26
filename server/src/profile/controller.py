from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.database.models import User


router = APIRouter(prefix="/profile", tags=["Profile"])


# ── Request schema (PATCH) ──────────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None


# ── Response schema ─────────────────────────────────────────────────────────
class ProfileResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    department: Optional[str] = None
    job_title: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


def build_profile_response(user: User) -> ProfileResponse:
    return ProfileResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        department=user.department,
        job_title=user.job_title,
        phone=user.phone,
        bio=user.bio,
        avatar_url=user.avatar_url,
        updated_at=user.updated_at,
    )


# ── GET /api/profile ─────────────────────────────────────────────────────────
@router.get("", response_model=ProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    result = db.execute(
        select(User).where(User.id == 1)
    )

    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User profile not found",
        )

    return build_profile_response(user)


# ── PATCH /api/profile ───────────────────────────────────────────────────────
@router.patch("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
):
    result = db.execute(
        select(User).where(User.id == 1)
    )

    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User profile not found",
        )

    update_data = profile_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(user, field, value)

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update user profile",
        ) from exc

    return build_profile_response(user)