from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date
from .core import Base

class Contract(Base):
    __tablename__ = "contracts"
    __table_args__ = {"extend_existing": True}

    id = Column(String, primary_key=True, index=True)

    company = Column(String)
    contract = Column(String)
    category = Column(String)
    value = Column(String)

    owner = Column(String)
    status = Column(String)
    compliance = Column(Integer)
    renewal = Column(String)

    start_date = Column(String)
    end_date = Column(String)

    days_remaining = Column(Integer)
    priority = Column(String)
    description = Column(String)

    paid_amount = Column(String)
    outstanding = Column(String)
    currency = Column(String)
    payment_progress = Column(Integer)

    renewal_type = Column(String)
    notice_period = Column(String)
    auto_renewal = Column(String)

    created_on = Column(String)
    effective_date = Column(String)
    expiry_date = Column(String)
    renewal_reminder = Column(String)

    documents = Column(Integer)
    obligations = Column(Integer)
    tasks = Column(Integer)

# -----------------------------
# Activity Model
# -----------------------------
class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    time = Column(String)

# -----------------------------
# Deadline Model
# -----------------------------
class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(String)

# -----------------------------
# Compliance Model
# -----------------------------
class ComplianceItem(Base):
    __tablename__ = "compliance_items"

    id = Column(Integer, primary_key=True, index=True)
    # --- UPDATED: Removed the accidental duplicate columns here ---
    item_name = Column(String)
    description = Column(String)
    contract_ref = Column(String)
    obligation = Column(String)
    status = Column(String)
    risk_level = Column(String)
    last_review = Column(Date, nullable=True)
    next_review = Column(Date)
    owner_name = Column(String)

class ReportHistory(Base):
    __tablename__ = "report_history"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    generated_by = Column(String)
    date = Column(String)
    format = Column(String)
    status = Column(String)

# -----------------------------
# User Model
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    department = Column(String)
    role = Column(String)
    status = Column(String)
    phone = Column(String)

    date_joined = Column(Date)
    last_login = Column(DateTime)