from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone

from src.audit.service import create_audit_log
from src.auth.dependencies import NOTIFICATION_ROLES, require_roles
from src.database.core import get_db
from src.database.models import Notification, User

router = APIRouter(prefix="/notifications", tags=["Notifications"])
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
    current_user: User = Depends(require_roles(*NOTIFICATION_ROLES)),
    db: Session = Depends(get_db),
):
    user_id = current_user.id
    query = (
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.id.desc())
    )
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
    current_user: User = Depends(require_roles(*NOTIFICATION_ROLES)),
    db: Session = Depends(get_db),
):
    user_id = current_user.id
    q = select(Notification).where(
        Notification.id == id,
        Notification.user_id == user_id,
    )
    item = db.execute(q).scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    item.is_read = True
    db.add(item)
    db.commit()

    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="UPDATE",
        action="Notification Marked Read",
        module="Notifications",
        description=(
            f"Marked notification as read: {item.title} "
            f"(ID: {item.id})"
        ),
    )

    return {"status": "success"}


@router.post("/mark-all-read")
def mark_all_read(
    current_user: User = Depends(require_roles(*NOTIFICATION_ROLES)),
    db: Session = Depends(get_db),
):
    user_id = current_user.id
    q = (
        update(Notification)
        .where(Notification.user_id == user_id)
        .values(is_read=True)
    )
    result = db.execute(q)
    db.commit()

    scope = f"user ID: {user_id}"
    affected_count = getattr(result, "rowcount", None)
    count_description = (
        f", affected: {affected_count}"
        if affected_count is not None
        else ""
    )
    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="UPDATE",
        action="All Notifications Marked Read",
        module="Notifications",
        description=(
            f"Marked all notifications as read for {scope}"
            f"{count_description}"
        ),
    )

    return {"status": "success"}


@router.delete("/{id}")
def dismiss_notification(
    id: int,
    current_user: User = Depends(require_roles(*NOTIFICATION_ROLES)),
    db: Session = Depends(get_db),
):
    user_id = current_user.id
    q = select(Notification).where(
        Notification.id == id,
        Notification.user_id == user_id,
    )
    item = db.execute(q).scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification_id = item.id
    notification_title = item.title
    db.delete(item)
    db.commit()

    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="DELETE",
        action="Notification Dismissed",
        module="Notifications",
        description=(
            f"Dismissed notification: {notification_title} "
            f"(ID: {notification_id})"
        ),
    )

    return {"status": "success"}
