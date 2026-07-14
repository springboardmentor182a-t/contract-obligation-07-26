from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from database.core import get_db
from entities.notification import Notification
from entities.user import User
from users.service import admin_required
from auth.service import verify_token
from notifications.models import NotificationResponse

router = APIRouter(
    prefix="/notification",
    tags=["Notifications"],
)


@router.get("/notifications")
def get_notifications(
    payload: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")
    notifications = (
        db.query(Notification).filter(Notification.user_id == user.user_id).all()
    )
    return notifications


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
