from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ObligationCreate(BaseModel):
    contract_id: int
    title: str
    description: Optional[str] = None
    assigned_to: str
    due_date: datetime
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Pending"

class ObligationUpdate(BaseModel):
    contract_id: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class ObligationResponse(BaseModel):
    obligation_id: int
    contract_id: int
    title: str
    description: Optional[str] = None
    assigned_to: str
    due_date: datetime
    completed: bool
    completed_date: Optional[datetime] = None
    priority: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
