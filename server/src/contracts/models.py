# server/src/contracts/models.py
from pydantic import BaseModel
from datetime import date

class ContractResponse(BaseModel):
    id: str
    title: str
    party: str
    status: str
    effective_date: date
    expiry_date: date

    class Config:
        from_attributes = True