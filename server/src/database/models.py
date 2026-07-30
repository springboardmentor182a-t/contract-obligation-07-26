from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String)
    status = Column(String)
    lastLogin = Column(String)

class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String, unique=True, index=True)
    vendor = Column(String)
    type = Column(String)
    status = Column(String)
    value = Column(Float)
    owner = Column(String)
    date = Column(Date)
    # NEW: needed for the dashboard's Risk Distribution / Department Performance widgets
    risk = Column(String, default="Low")           # Low | Medium | High | Critical
    department = Column(String, default="Legal")   # Legal | Procurement | HR | Finance | Operations | IT
    obligations = relationship("Obligation", back_populates="contract")
    renewals = relationship("Renewal", back_populates="contract")

class Obligation(Base):
    __tablename__ = "obligations"
    id = Column(Integer, primary_key=True, index=True)
    obligation_id = Column(String, unique=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    description = Column(String)
    dueDate = Column(Date)
    status = Column(String)
    priority = Column(String)
    contract = relationship("Contract", back_populates="obligations")

class Renewal(Base):
    __tablename__ = "renewals"
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    renewal_date = Column(Date)
    status = Column(String)
    contract = relationship("Contract", back_populates="renewals")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    date = Column(String)
    description = Column(String)
    amount = Column(String)
    status = Column(String)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    time = Column(String)
    user = Column(String)
    action = Column(String)
    target = Column(String)
    ip = Column(String)

class TaxEstimator(Base):
    __tablename__ = "tax_estimators"
    id = Column(Integer, primary_key=True, index=True)
    estimatedTax = Column(String)
    taxRate = Column(String)
    deductions = Column(String)
    netIncome = Column(String)
    breakdown = Column(String)
