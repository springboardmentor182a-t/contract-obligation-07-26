from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    Enum as SQLEnum,
)
from sqlalchemy.sql import func
from enum import Enum
from sqlalchemy.orm import relationship

from database.core import Base


class UserRole(str, Enum):
    ADMIN = "Admin"
    LEGAL_MANAGER = "Legal Manager"
    COMPLIANCE_OFFICER = "Compliance Officer"
    CONTRACT_MANAGER = "Contract Manager"


class User(Base):
    __tablename__ = "users"

    # Basic Information
    user_id = Column(Integer, primary_key=True, index=True)
    role = Column(SQLEnum(UserRole), nullable=False)
    full_name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True)
    phone = Column(String(15), nullable=False)
    password = Column(String(255), nullable=False)
    employee_id = Column(String(20), nullable=False)

    # Organization Details
    company_name = Column(String(255), nullable=True)
    department = Column(String(255), nullable=False)
    designation = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    join_date = Column(DateTime(timezone=True), server_default=func.now())

    notifications = relationship("Notification", back_populates="user")
    is_active = Column(Boolean, default=True)
