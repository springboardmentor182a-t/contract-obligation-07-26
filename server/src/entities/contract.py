<<<<<<< HEAD
from sqlalchemy import Column, Integer, String

from src.database.core import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    status = Column(String, nullable=False)
    expiry = Column(String, nullable=False)
=======
from pydantic import BaseModel


class Contract(BaseModel):
    id: str
    company: str
    contract: str
    category: str
    value: str
    owner: str
    status: str
    compliance: int
    renewal: str

    start_date: str
    end_date: str
    days_remaining: int
    priority: str
    description: str

    paid_amount: str
    outstanding: str
    currency: str
    payment_progress: int

    renewal_type: str
    notice_period: str
    auto_renewal: str

    created_on: str
    effective_date: str
    expiry_date: str
    renewal_reminder: str

    documents: int
    obligations: int
    tasks: int
>>>>>>> origin/main-group-D
