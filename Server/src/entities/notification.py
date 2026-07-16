from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database.core import Base


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    user = relationship("User", back_populates="notifications")
    date = Column(DateTime(timezone=True), server_default=func.now())
    title = Column(String(250), nullable=False)
    message = Column(String(1000), nullable=False)
