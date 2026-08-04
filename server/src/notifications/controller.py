from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from jose import JWTError, jwt as jose_jwt
from datetime import datetime, timezone

from src.auth.jwt import SECRET_KEY, ALGORITHM
from src.database.core import get_db
from src.database.models import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def _get_user_id(token: Optional[str]) -> Optional[int]:
    if not token:
        return None
    try:
        payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub", 0)) or None
    except (JWTError, ValueError):
        return None


def _fmt_time(dt: datetime) -> str:
    if dt is None:
        return ""
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    diff_min = int((now - dt).total_seconds() / 60)
    if diff_min < 1:
        return "Just now"
    if diff_min < 60:
        return f"{diff_min} min ago"
    if diff_min < 1440:
        return f"{diff_min // 60} hr ago"
    return dt.strftime("%b %d")


class NotificationResponse(BaseModel):
    id: int
    cat: str
    urgency: str
    title: str
    desc: str
    time: str
    isRead: bool
    read: bool

    model_config = ConfigDict(from_attributes=True)


@router.get("", response_model=List[NotificationResponse])
def list_notifications(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    query = select(Notification).order_by(Notification.id.desc())
    if user_id:
        query = query.where(Notification.user_id == user_id)
    items = db.execute(query).scalars().all()
    return [
        NotificationResponse(
            id=item.id,
            cat=item.category or "System",
            urgency=item.urgency or "normal",
            title=item.title,
            desc=item.description or "",
            time=_fmt_time(item.created_at),
            isRead=item.is_read,
            read=item.is_read,
        )
        for item in items
    ]


@router.patch("/{id}/read")
def mark_as_read(
    id: int,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    q = select(Notification).where(Notification.id == id)
    if user_id:
        q = q.where(Notification.user_id == user_id)
    item = db.execute(q).scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    item.is_read = True
    db.add(item)
    db.commit()
    return {"status": "success"}


@router.post("/mark-all-read")
def mark_all_read(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    q = update(Notification).values(is_read=True)
    if user_id:
        q = q.where(Notification.user_id == user_id)
    db.execute(q)
    db.commit()
    return {"status": "success"}


@router.delete("/{id}")
def dismiss_notification(
    id: int,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    q = select(Notification).where(Notification.id == id)
    if user_id:
        q = q.where(Notification.user_id == user_id)
    item = db.execute(q).scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    db.delete(item)
    db.commit()
    return {"status": "success"}
