from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
class UserManagementBase(BaseModel):
    email: EmailStr
    name: str
    department: str
    role: str
    status: str = "Active"

    phone: Optional[str] = None
    date_joined: Optional[date] = None
    last_login: Optional[datetime] = None


class UserManagementCreate(BaseModel):
    email: EmailStr
    name: str
    department: str
    role: str
    status: str = "Active"


class UserManagementResponse(UserManagementBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
