# server/src/renewals/models.py
from pydantic import BaseModel
from datetime import date

class RenewalResponse(BaseModel):
    id: int
    contract_id: str
    status: str
    expiry_date: date
    renewal_date: date
    owner: str

    class Config:
        from_attributes = True