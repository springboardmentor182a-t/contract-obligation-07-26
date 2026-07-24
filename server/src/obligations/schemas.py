from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel


class ObligationBase(BaseModel):
    title: str
    description: Optional[str] = None
    contract_id: int
    owner_id: int
    priority: str
    status: str
    due_date: date


class ObligationCreate(ObligationBase):
    pass


class ObligationUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    contract_id: Optional[int] = None
    owner_id: Optional[int] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[date] = None


class ObligationResponse(ObligationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True