from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime


class ComplianceLogResponse(BaseModel):
    id: int
    timestamp: str
    status: str
    message: str

    model_config = ConfigDict(from_attributes=True)


class ComplianceControlResponse(BaseModel):
    id: str
    title: str
    status: str
    weight: int
    lastVerified: str
    logs: List[ComplianceLogResponse] = []

    model_config = ConfigDict(from_attributes=True)


class ComplianceControlCreate(BaseModel):
    id: str
    title: str
    status: str = "PASSED"
    weight: int = 100


class ComplianceLogCreate(BaseModel):
    status: str = "VERIFIED"
    message: str


class ComplianceSummaryResponse(BaseModel):
    overallScore: int
    passedChecks: int
    warningsOutstanding: int
    failedPolicies: int
    totalControls: int
