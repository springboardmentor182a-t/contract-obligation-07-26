from sqlalchemy import Column, Integer, String
from src.database.core import Base


class AuditLog(Base):

    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True)

    action = Column(String(255))

    performed_by = Column(String(100))