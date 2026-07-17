from pydantic import BaseModel
from typing import Optional

class ContractCreate(BaseModel):
    id: str
    vendor: str
    type: str
    status: str
    value: str
    owner: str
