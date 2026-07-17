from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum as SQLEnum,
)


from database.core import Base
from entities.compliance import Compliance
from entities.user import User
from entities.obligation import Obligation
from entities.renewal import Renewal


class ContractStatus(str, Enum):
    DRAFT = "Draft"
    PENDING = "Pending"
    UNDER_REVIEW = "Under Review"
    ACTIVE = "Active"
    RENEWAL_DUE = "Renewal Due"
    EXPIRED = "Expired"
    TERMINATED = "Terminated"


class ContractCategories(str, Enum):
    EMPLOYMENT_CONTRACTS = "Employment Contracts"
    VENDOR_CONTRACTS = "Vendor Contracts"
    SERVICE_AGREEMENTS = "Service Agreements"
    LEASE_AGREEMENTS = "Lease Agreements"
    PURCHASE_AGREEMENTS = "Purchase Agreements"
    PARTNERSHIP_AGREEMENTS = "Partnership Agreements"
    CONFIDENTIALITY_AGREEMENTS = "Confidentiality Agreements"


class Contract(Base):
    __tablename__ = "contracts"

    contract_id = Column(Integer, primary_key=True, index=True)
    titile = Column(SQLEnum(ContractCategories), nullable=False)
    category = Column(SQLEnum(ContractCategories), nullable=False)
    department = Column(String(200), nullable=False)
    company_name = Column(String(200), nullable=False)
    vendor_name = Column(String(200), nullable=False)
    responsible_person = Column(String(250), nullable=False)
    contract_value = Column(Integer, nullable=False)
    description = Column(String(500), nullable=False)
    status = Column(String(100), default=ContractStatus.PENDING,nullable=False)

    approval_date = Column(DateTime, nullable=True)
    sent_review_date = Column(DateTime, nullable=True)
    expiry_date = Column(DateTime, nullable=False)
    effective_date = Column(DateTime, nullable=False)
    create_at = Column(DateTime(timezone=True), server_default=func.now())

    obligations = relationship(
        "Obligation", back_populates="contract", cascade="all, delete-orphan"
    )
    compliances = relationship(
        "Compliance", back_populates="contract", cascade="all, delete-orphan"
    )
