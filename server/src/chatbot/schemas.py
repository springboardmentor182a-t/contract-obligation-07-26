from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    contract_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    contract_id: Optional[int] = None
    response: str
