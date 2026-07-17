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


# -----------------------------
# User Management Models
# -----------------------------

class UserManagementBase(BaseModel):
    email: EmailStr
    name: str
    department: str
    role: str
    status: str
    phone: str
    date_joined: Optional[date] = None
    last_login: Optional[datetime] = None


class UserManagementCreate(UserManagementBase):
    password: str


class UserManagementResponse(UserManagementBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True