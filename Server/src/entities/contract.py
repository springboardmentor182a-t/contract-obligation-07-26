from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    Boolean,
)


from src.database.core import Base


class ContractStatus(str, Enum):

    DRAFT = "Draft"
    PENDING = "Pending"
    UNDER_REVIEW = "Under Review"
    ACTIVE = "Active"
    RENEWAL_DUE = "Renewal Due"
    EXPIRED = "Expired"
    TERMINATED = "Terminated"


class Contract(Base):

    __tablename__ = "contracts"

    contract_id = Column(Integer, primary_key=True, index=True)

    title = Column(String(250), nullable=False)
    vendor = Column(String(200), nullable=False)
    type = Column(String(100), nullable=False)
    value = Column(Float, nullable=False)
    end_date = Column(Date, nullable=False)
    owner = Column(String(200), nullable=False)
    status = Column(String(100), default=ContractStatus.ACTIVE.value, nullable=False)
    compliance = Column(String(100), default="Compliant", nullable=False)
    archived = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    obligations = relationship(
        "Obligation", back_populates="contract", cascade="all, delete-orphan"
    )

    compliances = relationship(
        "Compliance", back_populates="contract", cascade="all, delete-orphan"
    )
