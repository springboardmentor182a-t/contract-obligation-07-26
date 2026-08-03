from datetime import date
from typing import List, Optional

from pydantic import BaseModel


# -----------------------------
# Compliance Summary Cards
# -----------------------------
class ComplianceSummary(BaseModel):
    total_contracts: int
    compliant_contracts: int
    high_risk_contracts: int
    overdue_obligations: int
    missing_approvals: int
    missing_documents: int


# -----------------------------
# Compliance Table Row
# -----------------------------
class ComplianceRecord(BaseModel):
    contract_id: int
    contract_name: str
    vendor: str

    risk_level: str
    compliance_status: str

    approval_status: str
    mandatory_documents: bool

    overdue_obligations: int

    next_deadline: Optional[date] = None

    recommendation: str


# -----------------------------
# Alert
# -----------------------------
class ComplianceAlert(BaseModel):
    severity: str
    title: str
    message: str


# -----------------------------
# Dashboard Response
# -----------------------------
class ComplianceDashboardResponse(BaseModel):
    summary: ComplianceSummary
    records: List[ComplianceRecord]
    alerts: List[ComplianceAlert]