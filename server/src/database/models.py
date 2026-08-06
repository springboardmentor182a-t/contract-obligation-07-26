from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Float
from .core import Base

class Contract(Base):
    __tablename__ = "contracts"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    company = Column(String)
    contract = Column(String)
    category = Column(String)
    value = Column(String)

    owner = Column(String)
    status = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    value = Column(Float)
    department = Column(String, default="General")

    # --- Extended fields merged safely ---
    company = Column(String, nullable=True)
    contract = Column(String, nullable=True)
    category = Column(String, nullable=True)
    owner = Column(String, nullable=True)
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

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    time = Column(String)

class Deadline(Base):
    __tablename__ = "deadlines"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(String)

class ComplianceItem(Base):
    __tablename__ = "compliance_items"
    id = Column(Integer, primary_key=True, index=True)
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

# -----------------------------
# Document Model
# -----------------------------
class Document(Base):
    __tablename__ = "documents"
    __table_args__ = {'extend_existing': True}
    
    id = Column(Integer, primary_key=True, index=True)
    is_folder = Column(Boolean, default=False)
    name = Column(String, index=True)
    sub = Column(String) 
    type = Column(String)
    type_color = Column(String, nullable=True)
    contract_id = Column(String, nullable=True)
    contract_name = Column(String, nullable=True)
    uploader = Column(String)
    date = Column(String)
    time = Column(String)
    size = Column(String, nullable=True)
    
    # --- NEW: Enables Folder Hierarchy ---
    parent_id = Column(Integer, nullable=True)

class AppNotification(Base):
    __tablename__ = "app_notifications"
    __table_args__ = {'extend_existing': True}
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String)
    time = Column(String)
    is_read = Column(Boolean, default=False)