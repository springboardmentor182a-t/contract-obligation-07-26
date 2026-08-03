from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    Text,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import Column, Integer, String, Float, Date, Text, DateTime
from src.database.core import Base


class Contract(Base):
    __tablename__ = "contracts"
    __table_args__ = {"schema": "public"}

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

    # Existing
    risk_level = Column(String, default="Low")

    # Existing
    owner = Column(String, nullable=True)
    renewal_type = Column(String, default="Manual")

    description = Column(Text, nullable=True)

    
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # One Contract -> Many Documents
    documents = relationship(
        "ContractDocument",
        back_populates="contract",
        cascade="all, delete-orphan",
    )


class ContractDocument(Base):
    __tablename__ = "contract_documents"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    contract_id = Column(
        Integer,
        ForeignKey("public.contracts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    file_name = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_type = Column(String(100), nullable=False)
    file_size = Column(Integer, nullable=False)
    file_path = Column(String(500), nullable=False)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    contract = relationship(
        "Contract",
        back_populates="documents",
    )