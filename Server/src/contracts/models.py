from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict


# --- BASE SCHEMA ---
class ContractBase(BaseModel):
    title: str
    vendor: str
    type: str
    value: float
    end_date: date
    owner: str
    status: Optional[str] = "Active"
    compliance: Optional[str] = "Compliant"


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


# --- DELETE SCHEMA ---
# Typically, a delete operation only requires an ID, but if you pass data, 
# this schema keeps all fields optional.
class ContractDelete(BaseModel):
    title: Optional[str] = None
    vendor: Optional[str] = None
    type: Optional[str] = None
    value: Optional[float] = None
    end_date: Optional[date] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    compliance: Optional[str] = None


# --- RESPONSE SCHEMA ---
class ContractResponse(ContractBase):
    id: int

    # Updated for Pydantic v2 (from_attributes replaces class Config: from_attributes = True)
    model_config = ConfigDict(from_attributes=True)