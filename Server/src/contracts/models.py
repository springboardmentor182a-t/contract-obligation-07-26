from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict

# --- BASE SCHEMA ---
class ContractBase(BaseModel):
    title: str
    vendor: str
    type: str
    value: float
    start_date: date  # <--- Added Start Date
    end_date: date
    owner: str
    status: Optional[str] = "Active"
    compliance: Optional[int] = 0  # 0 to 100 for your React progress bars
    
    # --- Added Dynamic Detail Fields ---
    description: Optional[str] = "No description provided for this contract."
    auto_renewal: Optional[str] = "N/A"
    payment_terms: Optional[str] = "N/A"
    governing_law: Optional[str] = "N/A"
    liability_cap: Optional[str] = "N/A"


# --- CREATE SCHEMA ---
class ContractCreate(ContractBase):
    pass


# --- UPDATE SCHEMA ---
class ContractUpdate(BaseModel):
    title: Optional[str] = None
    vendor: Optional[str] = None
    type: Optional[str] = None
    value: Optional[float] = None
    start_date: Optional[date] = None  # <--- Optional update support
    end_date: Optional[date] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    compliance: Optional[int] = None
    
    # --- Optional detail updates support ---
    description: Optional[str] = None
    auto_renewal: Optional[str] = None
    payment_terms: Optional[str] = None
    governing_law: Optional[str] = None
    liability_cap: Optional[str] = None


# --- RESPONSE SCHEMA ---
class ContractResponse(ContractBase):
    id: int

    # Allows SQLAlchemy models to map directly to Pydantic objects
    model_config = ConfigDict(from_attributes=True)