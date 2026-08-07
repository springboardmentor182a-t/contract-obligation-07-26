from sqlalchemy.orm import Session
from src.entities.notification import Notification
from src.notifications.notification_ai import NotificationPriorityEngine


def create_notification(db: Session, user_id: int, title: str, message: str):
    ai_result = NotificationPriorityEngine.calculate({"title": title, "message": message})
    
    notification = Notification(
        user_id=user_id, 
        title=title, 
        message=message,
        priority=ai_result["priority"],
        priority_score=ai_result["score"],
        priority_reason=ai_result["reason"]
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification
