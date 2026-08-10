from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


# --- CREATE SCHEMA ---
class ContractCreate(BaseModel):
    title: str
    vendor: str
    type: str
    value: float
    end_date: date
    owner: str
    status: str = "Active"
    compliance: str = "Compliant"
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    approved_date: Optional[datetime] = None
    review_date: Optional[datetime] = None


# --- UPDATE SCHEMA ---
class ContractUpdate(BaseModel):
    title: Optional[str] = None
    vendor: Optional[str] = None
    type: Optional[str] = None
    value: Optional[float] = None
    end_date: Optional[date] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    compliance: Optional[str] = None
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    approved_date: Optional[datetime] = None
    review_date: Optional[datetime] = None


# --- RESPONSE SCHEMA ---
class ContractResponse(BaseModel):
    id: int = Field(validation_alias="contract_id")
    title: str
    vendor: str
    type: str
    value: float
    end_date: date
    owner: str
    status: str
    compliance: str
    effective_date: Optional[date] = None
    expiry_date: Optional[date] = None
    file_path: Optional[str] = None
    approved_date: Optional[datetime] = None
    review_date: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)