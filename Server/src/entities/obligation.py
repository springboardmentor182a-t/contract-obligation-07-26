from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database.core import Base


class Obligation(Base):
    __tablename__ = "obligations"

    obligation_id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.contract_id"), nullable=False)
    title = Column(String(250), nullable=False)
    description = Column(String(1000), nullable=True)
    assigned_to = Column(String(200), nullable=False)
    due_date = Column(DateTime, nullable=False)
    completed = Column(Boolean, default=False)
    completed_date = Column(DateTime, nullable=True)
    priority = Column(String(50), default="Medium")
    status = Column(String(100), default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    contract = relationship("Contract", back_populates="obligations")
