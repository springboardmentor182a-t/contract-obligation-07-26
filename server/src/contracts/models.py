from sqlalchemy import Column, Integer, String, Date, Float
from src.database.core import Base


class ContractModel(Base):
    __tablename__ = "contracts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=True)
    party = Column(String, nullable=True)
    category = Column(String, nullable=True)
    value = Column(Float, nullable=True)
    owner = Column(String, nullable=True)
    status = Column(String, nullable=True)

    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)

    department = Column(String, default="General")

    compliance = Column(Integer, nullable=True)
    renewal = Column(String, nullable=True)
    days_remaining = Column(Integer, nullable=True)
    priority = Column(String, nullable=True)
    description = Column(String, nullable=True)
    paid_amount = Column(String, nullable=True)
    outstanding = Column(String, nullable=True)
    currency = Column(String, nullable=True)
    payment_progress = Column(Integer, nullable=True)
    renewal_type = Column(String, nullable=True)
    notice_period = Column(String, nullable=True)
    auto_renewal = Column(String, nullable=True)
    created_on = Column(String, nullable=True)
    effective_date = Column(String, nullable=True)
    expiry_date = Column(String, nullable=True)
    renewal_reminder = Column(String, nullable=True)
    documents = Column(Integer, nullable=True)
    obligations = Column(Integer, nullable=True)
    tasks = Column(Integer, nullable=True)


from pydantic import BaseModel
from typing import Optional


class ContractUpdate(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    party: Optional[str] = None
    category: Optional[str] = None
    value: Optional[float] = None
    owner: Optional[str] = None
    status: Optional[str] = None
    compliance: Optional[int] = None
    renewal: Optional[str] = None

    start_date: Optional[str] = None
    end_date: Optional[str] = None
    days_remaining: Optional[int] = None
    priority: Optional[str] = None
    description: Optional[str] = None

    paid_amount: Optional[str] = None
    outstanding: Optional[str] = None
    currency: Optional[str] = None
    payment_progress: Optional[int] = None

    renewal_type: Optional[str] = None
    notice_period: Optional[str] = None
    auto_renewal: Optional[str] = None

    created_on: Optional[str] = None
    effective_date: Optional[str] = None
    expiry_date: Optional[str] = None
    renewal_reminder: Optional[str] = None

    documents: Optional[int] = None
    obligations: Optional[int] = None
    tasks: Optional[int] = None