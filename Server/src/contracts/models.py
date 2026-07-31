from datetime import date
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

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)