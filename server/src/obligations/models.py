# server/src/obligations/models.py
from pydantic import BaseModel
from datetime import date

class ObligationResponse(BaseModel):
    id: int
    contract_id: str
    description: str
    assignee: str
    due_date: date
    status: str

    class Config:
        from_attributes = True