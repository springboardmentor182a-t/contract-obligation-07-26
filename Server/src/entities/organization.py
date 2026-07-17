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

from database.core import Base


class OrganizationType(str, Enum):
    PRIVATE_LIMITED = "Private Limited"
    PUBLIC_LIMITED = "Public Limited"
    PARTNERSHIP = "Partnership"
    GOVERNMENT = "Government"
    LLP = "LLP"
    NGO = "NGO"


class Organization(Base):
    __tablename__ = "organization"

    # Basic Information
    organization_id = Column(Integer, primary_key=True, index=True)
    organization_type = Column(SQLEnum(OrganizationType), nullable=False)
    company_name = Column(String(255), nullable=True)
    registration_number = Column(String(25), nullable=False)
    gst_number = Column(String(25), nullable=False)
    contact_number = Column(String(12), nullable=False)
    offical_email = Column(String(255), unique=True, index=True)

    country = Column(String(25), nullable=False)
    state = Column(String(25), nullable=False)
    city = Column(String(25), nullable=False)

    join_date = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
