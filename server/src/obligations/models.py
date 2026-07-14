from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel, Field

from src.entities.enums import ObligationType, ObligationCompletionStatus, ComplianceLevel


class ObligationCreateRequest(BaseModel):
    contract_id: UUID
    title: str = Field(min_length=2, max_length=255)
    description: str | None = None
    obligation_type: ObligationType
    due_date: date
    responsible_user_id: UUID


class ObligationUpdateRequest(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=255)
    description: str | None = None
    due_date: date | None = None
    responsible_user_id: UUID | None = None


class ObligationCompletionUpdateRequest(BaseModel):
    completion_status: ObligationCompletionStatus


class ObligationResponse(BaseModel):
    id: UUID
    contract_id: UUID
    title: str
    description: str | None
    obligation_type: ObligationType
    due_date: date
    responsible_user_id: UUID
    completion_status: ObligationCompletionStatus
    compliance_status: ComplianceLevel
    completed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
