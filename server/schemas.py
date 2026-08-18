from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime
from models import UserRole, RenewalStatus, ApprovalStatus


# ─── Auth Schemas ───────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: UserRole
    department: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: UserRole
    department: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


# ─── Contract Schemas ───────────────────────────────────────────────────────────
class ContractBase(BaseModel):
    contract_number: str
    title: str
    vendor_name: str
    category: str
    value: Optional[float] = None
    currency: str = "USD"
    start_date: date
    end_date: date
    status: str = "active"
    description: Optional[str] = None


class ContractCreate(ContractBase):
    pass


class ContractOut(ContractBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Renewal Schemas ────────────────────────────────────────────────────────────
class RenewalCreate(BaseModel):
    contract_id: int
    manager_id: int
    original_end_date: date
    proposed_end_date: Optional[date] = None
    renewal_value: Optional[float] = None
    notes: Optional[str] = None
    priority: str = "medium"


class RenewalUpdate(BaseModel):
    status: Optional[RenewalStatus] = None
    proposed_end_date: Optional[date] = None
    renewed_end_date: Optional[date] = None
    renewal_value: Optional[float] = None
    notes: Optional[str] = None
    priority: Optional[str] = None


class RenewalApprovalAction(BaseModel):
    status: ApprovalStatus
    comments: Optional[str] = None


class RenewalApprovalOut(BaseModel):
    id: int
    step: int
    status: ApprovalStatus
    comments: Optional[str]
    decided_at: Optional[datetime]
    approver: UserOut

    class Config:
        from_attributes = True


class RenewalReminderOut(BaseModel):
    id: int
    reminder_type: str
    scheduled_date: date
    is_sent: bool
    sent_at: Optional[datetime]
    recipient_email: Optional[str]
    message: Optional[str]

    class Config:
        from_attributes = True


class RenewalHistoryOut(BaseModel):
    id: int
    action: str
    old_status: Optional[str]
    new_status: Optional[str]
    changed_by: str
    changed_by_role: Optional[str]
    remarks: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class RenewalOut(BaseModel):
    id: int
    renewal_number: str
    contract_id: int
    manager_id: int
    status: RenewalStatus
    original_end_date: date
    proposed_end_date: Optional[date]
    renewed_end_date: Optional[date]
    renewal_value: Optional[float]
    notes: Optional[str]
    priority: str
    reminder_30_sent: bool
    reminder_60_sent: bool
    reminder_90_sent: bool
    created_at: datetime
    updated_at: Optional[datetime]
    contract: ContractOut
    manager: UserOut
    approvals: List[RenewalApprovalOut] = []
    reminders: List[RenewalReminderOut] = []
    history: List[RenewalHistoryOut] = []

    class Config:
        from_attributes = True


class RenewalStats(BaseModel):
    total: int
    upcoming: int
    in_progress: int
    renewed: int
    expired: int
    cancelled: int
    expiring_in_30_days: int
    expiring_in_60_days: int
    expiring_in_90_days: int
    total_renewal_value: float


class CustomReminderCreate(BaseModel):
    renewal_id: int
    scheduled_date: date
    recipient_email: str
    message: Optional[str] = None
