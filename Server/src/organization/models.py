from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    organization_type: str
    company_name: str
    registration_number: str
    gst_number: str
    contact_number: str
    offical_email: EmailStr
    country: str
    state: str
    city: str
    is_active: bool = True


class OrganizationUpdate(BaseModel):
    organization_id: int
    organization_type: str
    company_name: str
    registration_number: str
    gst_number: str
    contact_number: str
    offical_email: EmailStr
    country: str
    state: str
    city: str

    join_date: datetime
    is_active: bool


class OrganizationResponse(BaseModel):
    organization_id: int
    organization_type: str
    company_name: Optional[str] = None
    registration_number: Optional[str] = None
    gst_number: Optional[str] = None
    contact_number: Optional[str] = None
    offical_email: Optional[EmailStr] = None
    country: Optional[str] = None
    state: Optional[str] = None
    city: Optional[str] = None

    join_date: Optional[datetime] = None
    is_active: bool

    class Config:
        from_attributes = True
