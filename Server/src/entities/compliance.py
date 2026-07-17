from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from database.core import Base


class ComplianceStatus(str, Enum):
    COMPLIANT = "Compliant"
    NON_COMPLIANT = "Non-Compliant"
    IN_PROGRESS = "In Progress"
    PENDING = "Pending"
    COMPLETED = "Completed"


class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class Compliance(Base):
    __tablename__ = "compliances"

    compliance_id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.contract_id"), nullable=False)
    requirement = Column(String(250), nullable=False)
    category = Column(String(150), nullable=False)
    entity = Column(String(250), nullable=False)
    status = Column(String(100), default=ComplianceStatus.PENDING.value, nullable=False)
    risk_level = Column(String(100), default=RiskLevel.MEDIUM.value, nullable=False)
    last_audit = Column(DateTime, nullable=True)
    health_score = Column(Integer, nullable=True)
    audit_notes = Column(String(1000), nullable=True)
    next_review_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    contract = relationship("Contract", back_populates="compliances")
