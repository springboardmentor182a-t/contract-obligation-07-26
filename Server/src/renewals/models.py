from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class RenewalBase(BaseModel):
    contract_name: str
    contract_id_ref: str
    category: str
    vendor: str
    owner: str
    expiry_date: datetime
    notice_period_days: int = 30
    value: float = 0.0
    status: str = "Upcoming"
    auto_renew: bool = False


class RenewalCreate(RenewalBase):
    pass


class RenewalUpdate(BaseModel):
    status: str


class ApprovalResponse(BaseModel):
    approval_id: int
    renewal_id: int
    step_name: str
    status: str
    approver: str
    comments: Optional[str] = None
    acted_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReminderResponse(BaseModel):
    reminder_id: int
    renewal_id: int
    reminder_date: datetime
    message: Optional[str] = None
    sent: bool
    sent_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    history_id: int
    renewal_id: int
    action: str
    performed_by: str
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RenewalResponse(BaseModel):
    renewal_id: int
    contract_name: str
    contract_id_ref: str
    category: str
    vendor: str
    owner: str
    expiry_date: datetime
    notice_period_days: int
    value: float
    status: str
    auto_renew: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    days_until_expiry: Optional[int] = None

    class Config:
        from_attributes = True


class RenewalDetailResponse(RenewalResponse):
    approvals: List[ApprovalResponse] = []
    reminders: List[ReminderResponse] = []
    history: List[HistoryResponse] = []

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    upcoming: int = 0
    in_progress: int = 0
    renewed: int = 0
    expired: int = 0
    cancelled: int = 0
    expiring_soon_no_action: int = 0
    total_value_at_risk: float = 0.0


class ApprovalActionRequest(BaseModel):
    step_name: str
    action: str  # "Approved" or "Rejected"
    approver: str
    comments: Optional[str] = None


class ReminderCreateRequest(BaseModel):
    reminder_date: datetime
    message: Optional[str] = None


class StatusUpdateRequest(BaseModel):
    status: str
    performed_by: str = "System"
