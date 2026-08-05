from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import Notification
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime
import uuid

router = APIRouter()

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: Optional[str] = "system"  # obligation, renewal, approval, risk, system
    details: Optional[str] = None
    link: Optional[str] = None
    user_id: Optional[str] = "all"

def serialize_notification(n: Notification) -> dict:
    return {
        "id": n.id,
        "notification_id": n.notification_id,
        "user_id": n.user_id,
        "type": n.type,
        "title": n.title,
        "message": n.message,
        "details": n.details,
        "link": n.link,
        "is_read": n.is_read,
        "created_at": n.created_at.isoformat() if n.created_at else datetime.utcnow().isoformat()
    }

@router.get("")
@router.get("/")
def get_notifications(
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    GET /api/notifications
    Fetch all live notifications directly from the PostgreSQL notifications table.
    """
    query = db.query(Notification)
    if user_id and user_id.lower() not in ["all", "admin", "admin user"]:
        user_clean = user_id.strip().lower()
        query = query.filter(
            (Notification.user_id == user_clean) | 
            (Notification.user_id == user_id) | 
            (Notification.user_id == "all") | 
            (Notification.user_id == "demo@contractiq.com") |
            (Notification.user_id.is_(None))
        )
        
    notifications = query.order_by(Notification.created_at.desc()).all()
    return [serialize_notification(n) for n in notifications]

@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_notification(
    payload: NotificationCreate,
    db: Session = Depends(get_db)
):
    """
    POST /api/notifications
    Insert a new notification directly into the PostgreSQL database.
    """
    new_notif = Notification(
        notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
        user_id=payload.user_id or "all",
        type=payload.type or "system",
        title=payload.title,
        message=payload.message,
        details=payload.details,
        link=payload.link,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return serialize_notification(new_notif)

@router.put("/read-all")
def mark_all_as_read(
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """
    PUT /api/notifications/read-all
    Mark all unread notifications in PostgreSQL as read.
    """
    query = db.query(Notification).filter(Notification.is_read == False)
    if user_id and user_id.lower() not in ["all", "admin", "admin user"]:
        user_clean = user_id.strip().lower()
        query = query.filter(
            (Notification.user_id == user_clean) | 
            (Notification.user_id == user_id) | 
            (Notification.user_id == "all") | 
            (Notification.user_id == "demo@contractiq.com") |
            (Notification.user_id.is_(None))
        )
        
    unread_notifs = query.all()
    count = len(unread_notifs)
    for n in unread_notifs:
        n.is_read = True
        
    db.commit()
    return {
        "status": "success",
        "message": f"Marked {count} notifications as read in PostgreSQL database",
        "updated_count": count
    }

@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """
    PUT /api/notifications/{notification_id}/read
    Mark a specific notification as read in PostgreSQL.
    """
    n = None
    if notification_id.isdigit():
        n = db.query(Notification).filter(Notification.id == int(notification_id)).first()
    
    if not n:
        n = db.query(Notification).filter(Notification.notification_id == notification_id).first()
        
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found in PostgreSQL database")
        
    n.is_read = True
    db.commit()
    db.refresh(n)
    return serialize_notification(n)

@router.delete("/{notification_id}")
def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db)
):
    """
    DELETE /api/notifications/{notification_id}
    Delete a notification from PostgreSQL.
    """
    n = None
    if notification_id.isdigit():
        n = db.query(Notification).filter(Notification.id == int(notification_id)).first()
    if not n:
        n = db.query(Notification).filter(Notification.notification_id == notification_id).first()
    if not n:
        raise HTTPException(status_code=404, detail="Notification not found in PostgreSQL database")
        
    db.delete(n)
    db.commit()
    return {"status": "success", "message": f"Notification {notification_id} removed from PostgreSQL database"}
