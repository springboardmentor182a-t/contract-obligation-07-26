import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Text, Date, DateTime, ForeignKey, Boolean, Enum as SAEnum
from src.database.types import GUID
from sqlalchemy.orm import relationship

from src.database.core import Base
from src.entities.enums import ObligationType, ObligationCompletionStatus, ComplianceLevel


class Obligation(Base):
    __tablename__ = "obligations"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    contract_id = Column(GUID(), ForeignKey("contracts.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    obligation_type = Column(SAEnum(ObligationType), nullable=False)
    due_date = Column(Date, nullable=False)
    responsible_user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)

    completion_status = Column(
        SAEnum(ObligationCompletionStatus), nullable=False, default=ObligationCompletionStatus.PENDING
    )
    compliance_status = Column(
        SAEnum(ComplianceLevel), nullable=False, default=ComplianceLevel.PENDING
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)
    due_alert_sent = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    contract = relationship("Contract", back_populates="obligations")
    responsible_user = relationship("User")
