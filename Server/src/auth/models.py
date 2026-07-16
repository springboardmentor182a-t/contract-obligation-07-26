from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

from entities.user import UserRole


class Token(BaseModel):
    access_token: str
    token_type: str


class VerifyOTPRequest(BaseModel):
    email: str
    otp: int


class UserCreate(BaseModel):
    role: UserRole
    full_name: str
    email: EmailStr
    phone: str
    password: str

    employee_id: str
    organization_id: int
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


class NewPassword(BaseModel):
    email: str
    new_password: str


class UserUpdate(BaseModel):
    user_id: int
    role: str
    full_name: str
    email: EmailStr
    phone: str

    employee_id: str
    organization_id: int
    company_name: str
    department: str
    designation: str
    location: str
    join_date: datetime

    is_active: bool


class UserResponse(BaseModel):
    user_id: int
    role: str
    full_name: str
    email: EmailStr
    phone: str

    employee_id: str
    company_name: str
    organization_id: int
    department: str
    designation: str
    location: str
    join_date: datetime

    is_active: bool

    class Config:
        from_attributes = True
