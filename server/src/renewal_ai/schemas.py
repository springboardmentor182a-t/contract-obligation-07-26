from typing import List, Optional

from pydantic import BaseModel, Field


class RenewalStrategyResponse(BaseModel):
    contract_id: int
    renewal_id: Optional[int] = None

    recommendation: str
    confidence: int = Field(ge=0, le=100)
    risk_level: str

    reasons: List[str]
    alternative_strategy: Optional[str] = None
    suggested_action: str

    days_to_expiry: Optional[int] = None
    pending_obligations: int = 0
    overdue_obligations: int = 0