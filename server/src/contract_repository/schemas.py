from datetime import date
from typing import Optional
from pydantic import BaseModel, ConfigDict
from pydantic import BaseModel
from datetime import datetime

class ContractBase(BaseModel):
    contract_name: str
    contract_number: str

    vendor: str
    department: str
    contract_type: str

    start_date: date
    end_date: date

    contract_value: float

    status: str = "Active"

    # NEW
    risk_level: str = "Low"
    owner: Optional[str] = None
    renewal_type: str = "Manual"

    description: Optional[str] = None


class ContractCreate(ContractBase):
    pass


class ContractUpdate(BaseModel):
    contract_name: Optional[str] = None
    contract_number: Optional[str] = None

    vendor: Optional[str] = None
    department: Optional[str] = None
    contract_type: Optional[str] = None

    start_date: Optional[date] = None
    end_date: Optional[date] = None

    contract_value: Optional[float] = None

    status: Optional[str] = None

    # NEW
    risk_level: Optional[str] = None
    owner: Optional[str] = None
    renewal_type: Optional[str] = None

    description: Optional[str] = None


class ContractResponse(ContractBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ContractDocumentResponse(BaseModel):
    id: int
    contract_id: int
    file_name: str
    original_name: str
    file_type: str
    file_size: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


class ContractDocumentListResponse(BaseModel):
    documents: list[ContractDocumentResponse]


class DocumentUploadResponse(BaseModel):
    message: str
    document: ContractDocumentResponse