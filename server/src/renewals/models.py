from pydantic import BaseModel
from datetime import date


class Renewal(BaseModel):
    id: int
    contract_id: int
    renewal_date: date
    reminder_days: int
    status: str
    renewal_type: str