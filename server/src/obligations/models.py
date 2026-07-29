from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel

from src.entities.obligation import ObligationType, ObligationStatus, ObligationPriority


class ObligationCreateRequest(BaseModel):
    contract_id: UUID
    title: str
    description: Optional[str] = None
    obligation_type: ObligationType
    priority: ObligationPriority = ObligationPriority.MEDIUM
    owner_id: Optional[UUID] = None
    due_date: Optional[datetime] = None


class ObligationUpdateRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ObligationStatus] = None
    priority: Optional[ObligationPriority] = None
    owner_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    progress_percent: Optional[int] = None


class ObligationResponse(BaseModel):
    id: UUID
    contract_id: UUID
    contract_name: Optional[str] = None
    title: str
    obligation_type: ObligationType
    status: ObligationStatus
    priority: ObligationPriority
    owner_id: Optional[UUID] = None
    owner_name: Optional[str] = None
    due_date: Optional[datetime] = None
    progress_percent: int

    class Config:
        from_attributes = True