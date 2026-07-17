from enum import Enum

from sqlalchemy import Boolean, Column, DateTime, Enum as SQLEnum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.core import Base


class RenewalStatus(str, Enum):
    UPCOMING = "Upcoming"
    IN_PROGRESS = "In Progress"
    RENEWED = "Renewed"
    EXPIRED = "Expired"
    CANCELLED = "Cancelled"


class ApprovalStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


class Renewal(Base):
    """A contract renewal tracked independently from the contracts module."""

    __tablename__ = "renewals"

    renewal_id = Column(Integer, primary_key=True, index=True)
    contract_name = Column(String(255), nullable=False)
    contract_id_ref = Column(String(100), nullable=False, index=True)
    category = Column(String(150), nullable=False)
    vendor = Column(String(255), nullable=False)
    owner = Column(String(255), nullable=False)
    expiry_date = Column(DateTime, nullable=False, index=True)
    notice_period_days = Column(Integer, nullable=False, default=30)
    value = Column(Float, nullable=False, default=0.0)
    status = Column(SQLEnum(RenewalStatus), nullable=False, default=RenewalStatus.UPCOMING)
    auto_renew = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=True, onupdate=func.now())

    approvals = relationship("RenewalApproval", back_populates="renewal", cascade="all, delete-orphan")
    reminders = relationship("RenewalReminder", back_populates="renewal", cascade="all, delete-orphan")
    history = relationship("RenewalHistory", back_populates="renewal", cascade="all, delete-orphan")


class RenewalApproval(Base):
    __tablename__ = "renewal_approvals"

    approval_id = Column(Integer, primary_key=True, index=True)
    renewal_id = Column(Integer, ForeignKey("renewals.renewal_id"), nullable=False, index=True)
    step_name = Column(String(150), nullable=False)
    status = Column(SQLEnum(ApprovalStatus), nullable=False, default=ApprovalStatus.PENDING)
    approver = Column(String(255), nullable=False)
    comments = Column(String(1000), nullable=True)
    acted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    renewal = relationship("Renewal", back_populates="approvals")


class RenewalReminder(Base):
    __tablename__ = "renewal_reminders"

    reminder_id = Column(Integer, primary_key=True, index=True)
    renewal_id = Column(Integer, ForeignKey("renewals.renewal_id"), nullable=False, index=True)
    reminder_date = Column(DateTime, nullable=False)
    message = Column(String(1000), nullable=True)
    sent = Column(Boolean, nullable=False, default=False)
    sent_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    renewal = relationship("Renewal", back_populates="reminders")


class RenewalHistory(Base):
    __tablename__ = "renewal_history"

    history_id = Column(Integer, primary_key=True, index=True)
    renewal_id = Column(Integer, ForeignKey("renewals.renewal_id"), nullable=False, index=True)
    action = Column(String(500), nullable=False)
    performed_by = Column(String(255), nullable=False)
    details = Column(String(1000), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    renewal = relationship("Renewal", back_populates="history")
