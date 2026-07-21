from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    Text,
)
from sqlalchemy.sql import func

from src.database.core import Base

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)

    contract_name = Column(String, nullable=False)
    contract_number = Column(String, unique=True, nullable=False)

    vendor = Column(String, nullable=False)
    department = Column(String, nullable=False)
    contract_type = Column(String, nullable=False)

    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    contract_value = Column(Float, nullable=False)

    # Existing
    status = Column(String, default="Active")

    # NEW
    risk_level = Column(String, default="Low")

    # Optional but useful
    owner = Column(String, nullable=True)
    renewal_type = Column(String, default="Manual")

    description = Column(Text, nullable=True)
