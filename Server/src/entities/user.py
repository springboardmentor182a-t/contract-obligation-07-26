from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    Enum as SQLEnum,
    ForeignKey,
    JSON,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from enum import Enum

from database.core import Base


class UserRole(str, Enum):
    ADMIN = "Admin"
    LEGAL_MANAGER = "Legal Manager"
    COMPLIANCE_OFFICER = "Compliance Officer"
    PROCUREMENT_MANAGER = "Procurement Manager"
    BUSINESS_USER = "Business User"


class User(Base):
    __tablename__ = "users"

    # Basic Information
    user_id = Column(Integer, primary_key=True, index=True)
    role = Column(SQLEnum(UserRole), nullable=False)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(12), nullable=False)
    password = Column(String(255), nullable=False)
    employee_id = Column(String(20), nullable=False)

    # Organization Details
    company_name = Column(String(255), nullable=True)
    department = Column(String(255), nullable=False)
    designation = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    join_date = Column(DateTime(timezone=True), server_default=func.now())

    is_active = Column(Boolean, default=True)
