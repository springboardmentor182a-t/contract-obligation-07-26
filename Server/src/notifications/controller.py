from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from sqlalchemy import func


from src.database.core import get_db
from src.entities.notification import Notification
from src.entities.user import User
from src.users.service import admin_required
from src.auth.service import verify_token
from src.notifications.models import NotificationResponse, NotificaionCreate
from src.notifications.service import create_notification

router = APIRouter(
    prefix="/notification",
    tags=["Notifications"],
)


@router.post("/create_notification", response_model=NotificationResponse)
def create_new_notification(
    data: NotificaionCreate,
    payload: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")
    notification = create_notification(
        db=db,
        user_id=user.user_id,
        title=data.title,
        message=data.message,
    )

    return notification


@router.get("/notifications", response_model=list[NotificationResponse])
def get_notifications(
    priority: str = None,
    payload: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")

    query = db.query(Notification).filter(Notification.user_id == user.user_id)
    if priority and priority != "All":
        query = query.filter(Notification.priority == priority)
        
    notifications = query.order_by(Notification.priority_score.desc().nulls_last(), Notification.date.desc()).all()

    return notifications


@router.get("/notifications/summary")
def get_notification_summary(
    payload: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")

    results = (
        db.query(Notification.priority, func.count(Notification.notification_id))
        .filter(Notification.user_id == user.user_id)
        .group_by(Notification.priority)
        .all()
    )
    
    summary = {
        "critical": 0,
        "high": 0,
        "medium": 0,
        "low": 0
    }
    
    for p, count in results:
        if p:
            key = p.lower()
            if key in summary:
                summary[key] = count
            
    return summary


@router.get("/admin_notifications")
def get_admin_notifications(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    notifications = db.query(Notification).all()

    return notifications


@router.delete("/delete_notificaion/{notification_id}")
def delete_notification(
    notification_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not exist!!")

    notification = (
        db.query(Notification)
        .filter(
            Notification.notification_id == notification_id,
            Notification.user_id == user.user_id,
        )
        .first()
    )

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found!")

    db.delete(notification)
    db.commit()

    return {"message": "Notification deleted successfully"}
