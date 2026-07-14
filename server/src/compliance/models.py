# server/src/compliance/models.py
from pydantic import BaseModel
from datetime import date
from typing import Optional

class ComplianceCreate(BaseModel):
    contract_id: str
    item_name: str
    description: Optional[str] = "Standard compliance requirement"
    obligation: str
    status: str
    risk_level: str
    next_review: date
    owner_img: Optional[str] = "https://i.pravatar.cc/150?img=11"

class ComplianceResponse(ComplianceCreate):
    id: int
    last_review: Optional[date] = None

    class Config:
        from_attributes = True