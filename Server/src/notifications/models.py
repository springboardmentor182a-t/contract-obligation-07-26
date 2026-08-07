from pydantic import BaseModel
from datetime import datetime


from src.entities.user import User


class NotificaionCreate(BaseModel):
    title: str
    message: str
    user_id: int = 0


class NotificationResponse(BaseModel):

    notification_id: int
    user_id: int
    date: datetime
    title: str
    message: str
    priority: str | None = None
    priority_score: int | None = None
    priority_reason: str | None = None

    class Config:
        from_attributes = True
