from sqlalchemy import Column, Integer, Boolean, String, ForeignKey
from sqlalchemy.orm import relationship
from database.core import Base


class UserSettings(Base):
    __tablename__ = "user_settings"

    setting_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True)

    email_alerts = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=False)
    contract_expiry = Column(Boolean, default=True)
    weekly_reports = Column(Boolean, default=False)

    theme = Column(String, default="light")
    compact_mode = Column(Boolean, default=False)
    timezone = Column(String, default="Asia/Kolkata")

    user = relationship("User", back_populates="settings")
