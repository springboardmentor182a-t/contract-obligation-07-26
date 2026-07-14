from pydantic import BaseModel
from datetime import datetime

from entities.user import User


class NotificaionCreate(BaseModel):
    user_id: int
    title: str
    message: str


class NotificationResponse(BaseModel):
    notification_id: int
    user_id: int
    date: datetime
    title: str
    message: str

    class Config:
        from_attributes = True
