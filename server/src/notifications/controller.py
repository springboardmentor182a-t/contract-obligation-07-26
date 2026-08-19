from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, update
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, date, timedelta

from src.audit.service import create_audit_log
from src.auth.dependencies import NOTIFICATION_ROLES, require_roles
from src.database.core import get_db
from src.database.models import Notification, User, ObligationModel
from src.contract_repository.models import Contract

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.post("/generate")
def generate_notifications(
    current_user: User = Depends(require_roles(*NOTIFICATION_ROLES)),
    db: Session = Depends(get_db),
):
    """Auto-generate notifications from real DB data: expiring contracts, overdue obligations."""
    user_id = current_user.id
    created_count = 0
    today = date.today()

    # 1. Contracts expiring within 30 days
    soon = today + timedelta(days=30)
    expiring = db.execute(
        select(Contract).where(Contract.end_date >= today, Contract.end_date <= soon)
    ).scalars().all()

    for contract in expiring:
        days_left = (contract.end_date - today).days
        title = f"Contract Expiring: {contract.contract_name}"
        description = f"{contract.contract_name} (Vendor: {contract.vendor}) expires in {days_left} days on {contract.end_date}. Please initiate renewal."
        urgency = "critical" if days_left <= 7 else "warning"
        # Check not duplicate
        existing = db.execute(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.title == title,
            )
        ).scalars().first()
        if not existing:
            db.add(Notification(
                user_id=user_id,
                category="Renewals",
                urgency=urgency,
                title=title,
                description=description,
                is_read=False,
            ))
            created_count += 1

    # 2. Overdue obligations
    overdue_obs = db.execute(
        select(ObligationModel).where(
            ObligationModel.status == "overdue",
            ObligationModel.owner_id == user_id,
        ).limit(10)
    ).scalars().all()

    for ob in overdue_obs:
        title = f"Overdue Obligation: {ob.title}"
        description = f"The obligation '{ob.title}' was due on {ob.due_date} and is now overdue. Priority: {ob.priority}."
        existing = db.execute(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.title == title,
            )
        ).scalars().first()
        if not existing:
            db.add(Notification(
                user_id=user_id,
                category="Workflow",
                urgency="critical",
                title=title,
                description=description,
                is_read=False,
            ))
            created_count += 1

    # 3. High risk contracts
    high_risk = db.execute(
        select(Contract).where(Contract.risk_level == "High").limit(5)
    ).scalars().all()

    for contract in high_risk:
        title = f"High Risk Contract: {contract.contract_name}"
        description = f"Contract '{contract.contract_name}' with {contract.vendor} is flagged as High Risk. Review required."
        existing = db.execute(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.title == title,
            )
        ).scalars().first()
        if not existing:
            db.add(Notification(
                user_id=user_id,
                category="Risk Alerts",
                urgency="warning",
                title=title,
                description=description,
                is_read=False,
            ))
            created_count += 1

    db.commit()
    return {"generated": created_count, "message": f"{created_count} new notifications created."}

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
