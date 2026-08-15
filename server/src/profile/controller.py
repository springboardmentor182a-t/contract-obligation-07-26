from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.audit.service import create_audit_log
from src.auth.dependencies import ALL_ROLES, require_roles
from src.database.core import get_db
from src.database.models import User

router = APIRouter(prefix="/profile", tags=["Profile"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    job_title: Optional[str] = None
    department: Optional[str] = None
    avatar_url: Optional[str] = None


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


def _build_response(user: User) -> ProfileResponse:
    return ProfileResponse(
        id=user.id,
        full_name=user.full_name or user.name or user.email,
        email=user.email,
        role=user.role or "Employee",
        department=user.department,
        job_title=user.job_title,
        phone=user.phone,
        bio=user.bio,
        avatar_url=user.avatar_url,
        updated_at=user.updated_at,
    )


# ── GET /api/profile ────────────────────────────────────────────────────────
@router.get("", response_model=ProfileResponse)
def get_profile(
    current_user: User = Depends(require_roles(*ALL_ROLES)),
):
    return _build_response(current_user)


# ── PATCH /api/profile ───────────────────────────────────────────────────────
@router.patch("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(require_roles(*ALL_ROLES)),
    db: Session = Depends(get_db),
):
    update_data = profile_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    try:
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to update profile") from exc

    changed_fields = ", ".join(sorted(update_data)) or "none"
    create_audit_log(
        db=db,
        user_id=current_user.id,
        event_type="UPDATE",
        action="Profile Updated",
        module="Profile",
        description=(
            f"Updated profile: {current_user.email} "
            f"(ID: {current_user.id}, fields: {changed_fields})"
        ),
    )

    return _build_response(current_user)
