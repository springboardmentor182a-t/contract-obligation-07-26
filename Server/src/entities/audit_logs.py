from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.sql import func

from database.core import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    audit_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    user_name = Column(String(200), nullable=False, default="System")
    action = Column(String(100), nullable=False)
    module = Column(String(100), nullable=False, default="System")
    status = Column(String(50), default="Success")
    resource = Column(String(200), nullable=True)
    description = Column(String(500), nullable=True)
    ip_address = Column(String(50), nullable=True)
    entity_type = Column(String(100), nullable=True, index=True)
    entity_id = Column(String(100), nullable=True, index=True)
    category = Column(String(50), nullable=False, default="Activity", index=True)
    severity = Column(String(50), nullable=False, default="Info")
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)


class Activity(Base):
    __tablename__ = "activities"

    activity_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    user_name = Column(String(200), nullable=False, default="System")
    action = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    entity_type = Column(String(100), nullable=True)
    entity_id = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
