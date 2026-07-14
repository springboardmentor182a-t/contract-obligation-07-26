from pydantic import BaseModel, Field, ConfigDict
from datetime import date, datetime
from typing import List, Optional

class ComplianceRecordBase(BaseModel):
    requirement: str = Field(..., description="Compliance requirement, e.g. GDPR Data Processing")
    category: str = Field(..., description="Category, e.g. Data Privacy, Security")
    entity: str = Field(..., description="Legal Entity, e.g. TechCorp Solutions")
    contractId: str = Field(..., description="Contract identifier code")
    status: str = Field(..., description="Compliance status: Compliant, Non-Compliant, Warning, Under Review")
    risk: str = Field(..., description="Risk Profile: High, Medium, Low")
    lastAudit: date = Field(..., description="Last audit date YYYY-MM-DD")
    score: int = Field(..., description="Health score index, 0 to 100")

class ComplianceRecordCreate(ComplianceRecordBase):
    pass

class ComplianceRecordUpdate(BaseModel):
    requirement: Optional[str] = None
    category: Optional[str] = None
    entity: Optional[str] = None
    contractId: Optional[str] = None
    status: Optional[str] = None
    risk: Optional[str] = None
    lastAudit: Optional[date] = None
    score: Optional[int] = None

class ComplianceRecordResponse(BaseModel):
    id: str = Field(..., description="Formatted compliance ID, e.g. CMP-001")
    requirement: str
    category: str
    entity: str
    contractId: str = Field(..., validation_alias="contract_id")
    status: str
    risk: str
    lastAudit: date = Field(..., validation_alias="last_audit")
    score: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )

class DashboardSummaryResponse(BaseModel):
    compliance_score: float = Field(..., description="Overall compliance score percentage, e.g. 84.0")
    trend_value: float = Field(2.4, description="Overall compliance trend percentage, e.g. 2.4")
    
    compliant_contracts: int = Field(..., description="Count of compliant contracts")
    compliant_contracts_trend: str = Field("+12 this month", description="Compliant contracts card subtext")
    
    critical_violations: int = Field(..., description="Count of critical violations")
    critical_violations_trend: str = Field("Needs immediate action", description="Critical violations card subtext")
    
    pending_audits: int = Field(..., description="Count of pending audits")
    pending_audits_trend: str = Field("Scheduled for Q4", description="Pending audits card subtext")

class TrendItemResponse(BaseModel):
    month: str = Field(..., description="Month name (e.g. Jan, Feb, Mar)")
    compliance_score: float = Field(..., description="Average compliance score")

class RiskDistributionResponse(BaseModel):
    high: int = Field(..., description="High risk items count")
    medium: int = Field(..., description="Medium risk items count")
    low: int = Field(..., description="Low risk items count")

class PaginatedComplianceResponse(BaseModel):
    total: int = Field(..., description="Total matching records count")
    records: List[ComplianceRecordResponse] = Field(..., description="List of compliance items")
    skip: int = Field(..., description="Offset value")
    limit: int = Field(..., description="Limit value")