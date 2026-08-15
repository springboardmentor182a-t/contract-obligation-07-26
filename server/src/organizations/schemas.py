from pydantic import BaseModel, Field
from datetime import datetime

from enum import Enum

class OrganizationType(str, Enum):
    PRIVATE_LIMITED = "Private Limited"
    PUBLIC_LIMITED = "Public Limited"
    PARTNERSHIP = "Partnership"
    GOVERNMENT = "Government"
    LLP = "LLP"
    NGO = "NGO"

class OrganizationCreate(BaseModel):
    organization_type: OrganizationType
    company_name: str | None = Field(None, max_length=255)
    registration_number: str = Field(..., max_length=25)
    gst_number: str = Field(..., max_length=25)
    contact_number: str = Field(..., max_length=12)
    offical_email: str = Field(..., max_length=255)
    country: str = Field(..., max_length=25)
    state: str = Field(..., max_length=25)
    city: str = Field(..., max_length=25)
    is_active: bool | None = True

class OrganizationUpdate(BaseModel):
    organization_type: OrganizationType | None = None
    company_name: str | None = Field(None, max_length=255)
    registration_number: str | None = Field(None, max_length=25)
    gst_number: str | None = Field(None, max_length=25)
    contact_number: str | None = Field(None, max_length=12)
    offical_email: str | None = Field(None, max_length=255)
    country: str | None = Field(None, max_length=25)
    state: str | None = Field(None, max_length=25)
    city: str | None = Field(None, max_length=25)
    is_active: bool | None = None

class OrganizationResponse(BaseModel):
    organization_id: int
    organization_type: str
    company_name: str | None
    registration_number: str
    gst_number: str
    contact_number: str
    offical_email: str
    country: str
    state: str
    city: str
    join_date: datetime
    is_active: bool

    class Config:
        from_attributes = True

class UserAssignRequest(BaseModel):
    user_id: int
