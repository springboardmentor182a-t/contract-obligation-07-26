from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

from entities.user import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str


class UserCreate(BaseModel):
    role: UserRole
    full_name: str
    email: EmailStr
    phone: str
    password: str

    employee_id: str
    company_name: str
    department: str
    designation: str
    location: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChangePassword(BaseModel):
    old_password: str
    new_password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None

    company_name: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None
    location: Optional[str] = None

    is_active: Optional[bool] = None


class UserResponse(BaseModel):
    user_id: int
    role: str
    full_name: str
    email: EmailStr
    phone: str

    employee_id: str
    company_name: str
    department: str
    designation: str
    location: str
    join_date: datetime

    is_active: bool

    class Config:
        from_attributes = True
