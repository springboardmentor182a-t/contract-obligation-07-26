from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, Text, ForeignKey, Float, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base


class UserRole(str, enum.Enum):
    administrator = "administrator"
    legal_manager = "legal_manager"
    compliance_officer = "compliance_officer"
    contract_manager = "contract_manager"
    department_head = "department_head"
    employee = "employee"


class RenewalStatus(str, enum.Enum):
    upcoming = "upcoming"
    in_progress = "in_progress"
    renewed = "renewed"
    expired = "expired"
    cancelled = "cancelled"


class ApprovalStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.employee)
    department = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    renewals_managed = relationship("Renewal", back_populates="manager", foreign_keys="Renewal.manager_id")
    renewal_approvals = relationship("RenewalApproval", back_populates="approver")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    contract_number = Column(String(50), unique=True, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    vendor_name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    value = Column(Float, nullable=True)
    currency = Column(String(10), default="USD")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String(50), default="active")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    renewals = relationship("Renewal", back_populates="contract")


class Renewal(Base):
    __tablename__ = "renewals"

    id = Column(Integer, primary_key=True, index=True)
    renewal_number = Column(String(50), unique=True, nullable=False, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    manager_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(Enum(RenewalStatus), nullable=False, default=RenewalStatus.upcoming)
    
    original_end_date = Column(Date, nullable=False)
    proposed_end_date = Column(Date, nullable=True)
    renewed_end_date = Column(Date, nullable=True)
    
    renewal_value = Column(Float, nullable=True)
    notes = Column(Text, nullable=True)
    priority = Column(String(20), default="medium")  # low, medium, high, critical
    
    reminder_30_sent = Column(Boolean, default=False)
    reminder_60_sent = Column(Boolean, default=False)
    reminder_90_sent = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    contract = relationship("Contract", back_populates="renewals")
    manager = relationship("User", back_populates="renewals_managed", foreign_keys=[manager_id])
    approvals = relationship("RenewalApproval", back_populates="renewal", cascade="all, delete-orphan")
    reminders = relationship("RenewalReminder", back_populates="renewal", cascade="all, delete-orphan")
    history = relationship("RenewalHistory", back_populates="renewal", cascade="all, delete-orphan")


class RenewalApproval(Base):
    __tablename__ = "renewal_approvals"

    id = Column(Integer, primary_key=True, index=True)
    renewal_id = Column(Integer, ForeignKey("renewals.id"), nullable=False)
    approver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    step = Column(Integer, default=1)  # approval step number
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.pending)
    comments = Column(Text, nullable=True)
    decided_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    renewal = relationship("Renewal", back_populates="approvals")
    approver = relationship("User", back_populates="renewal_approvals")


class RenewalReminder(Base):
    __tablename__ = "renewal_reminders"

    id = Column(Integer, primary_key=True, index=True)
    renewal_id = Column(Integer, ForeignKey("renewals.id"), nullable=False)
    reminder_type = Column(String(20), nullable=False)  # 30day, 60day, 90day, custom
    scheduled_date = Column(Date, nullable=False)
    sent_at = Column(DateTime(timezone=True), nullable=True)
    is_sent = Column(Boolean, default=False)
    recipient_email = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    renewal = relationship("Renewal", back_populates="reminders")


class RenewalHistory(Base):
    __tablename__ = "renewal_history"

    id = Column(Integer, primary_key=True, index=True)
    renewal_id = Column(Integer, ForeignKey("renewals.id"), nullable=False)
    action = Column(String(100), nullable=False)
    old_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=True)
    changed_by = Column(String(255), nullable=False)
    changed_by_role = Column(String(100), nullable=True)
    remarks = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    renewal = relationship("Renewal", back_populates="history")
