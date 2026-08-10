from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, Field


class ContractSummary(BaseModel):
    id: int
    contract_name: str
    contract_number: str
    vendor: str
    department: str
    contract_type: str
    contract_value: float
    status: str
    stored_risk_level: str
    owner: Optional[str] = None
    renewal_type: str
    description: Optional[str] = None
    start_date: date
    end_date: date


class ObligationSummary(BaseModel):
    total: int
    completed: int
    pending: int
    overdue: int


class ComplianceSummary(BaseModel):
    status: str
    percentage: Optional[int] = None
    approval_status: str
    documents_available: bool
    signals: list[str]
    limitation: Optional[str] = None


class RenewalSummary(BaseModel):
    linked: bool
    renewal_id: Optional[int] = None
    status: str
    approval_status: Optional[str] = None
    renewal_date: Optional[date] = None
    end_date: date
    days_remaining: int
    source: Literal["renewal", "contract"]


class ScoreFactor(BaseModel):
    factor: str
    detail: str
    penalty: int = Field(ge=0)


class ScoreBreakdown(BaseModel):
    base_score: int = 100
    total_penalty: int = Field(ge=0)
    factors: list[ScoreFactor]


class AIInsights(BaseModel):
    overall_assessment: str
    key_findings: list[str]
    recommended_actions: list[str]
    available: bool
    error_message: Optional[str] = None


class ContractInsightsResponse(BaseModel):
    contract: ContractSummary
    health_score: int = Field(ge=0, le=100)
    risk_level: Literal["Low", "Medium", "High"]
    renewal: RenewalSummary
    obligations: ObligationSummary
    compliance: ComplianceSummary
    score_breakdown: ScoreBreakdown
    ai: AIInsights
