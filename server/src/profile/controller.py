from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError, jwt as jose_jwt
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.audit.service import create_audit_log
from src.auth.jwt import SECRET_KEY, ALGORITHM
from src.database.core import get_db
from src.database.models import User

router = APIRouter(prefix="/profile", tags=["Profile"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


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


def _get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    """Decode JWT and return the matching User row.  
    Falls back to the first active user when the token is missing/invalid
    (useful for unauthenticated local dev – NEVER do this in production).
    """
    if token:
        try:
            payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub", 0))
            if user_id:
                user = db.execute(select(User).where(User.id == user_id)).scalars().first()
                if user:
                    return user
        except (JWTError, ValueError):
            pass

    # Unauthenticated fallback: first active user in DB
    user = db.execute(select(User).where(User.is_active.is_(True))).scalars().first()
    if user:
        return user

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")


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
def get_profile(current_user: User = Depends(_get_current_user)):
    return _build_response(current_user)


# ── PATCH /api/profile ───────────────────────────────────────────────────────
@router.patch("", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(_get_current_user),
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
