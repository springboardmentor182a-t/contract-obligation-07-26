from sqlalchemy import Column, Integer, Text
from pydantic import BaseModel

from src.database.core import Base


class ContractModel(Base):
    __tablename__ = "contracts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    company = Column(Text)
    contract = Column(Text)
    category = Column(Text)
    value = Column(Text)
    owner = Column(Text)
    status = Column(Text)
    compliance = Column(Integer)
    renewal = Column(Text)

    start_date = Column(Text)
    end_date = Column(Text)
    days_remaining = Column(Integer)
    priority = Column(Text)
    description = Column(Text)

    paid_amount = Column(Text)
    outstanding = Column(Text)
    currency = Column(Text)


class ContractCreate(BaseModel):
    title: str
    owner: str
    status: str
    expiry: str


class ContractResponse(ContractCreate):
    id: int

    class Config:
        from_attributes = True