from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.core import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    audit_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.user_id"))
    user_name = Column(String(50), nullable=False)

    action = Column(String(100), nullable=False)
    module = Column(String(100), nullable=False)
    status = Column(String(200))
    resource = Column(String(200))
    description = Column(String(500))

    ip_address = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
