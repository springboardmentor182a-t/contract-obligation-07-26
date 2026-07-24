

from pydantic import BaseModel
from typing import Optional
class Renewal(BaseModel):
    id: Optional[int] = None
    contract_name: str
    renewal_type: str
    renewal_date: str
    reminder_days: int
    status: str