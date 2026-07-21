from sqlalchemy import Column, Integer, Text, Float
from src.database.core import Base

class ContractModel(Base):
    __tablename__ = "contracts"
    __table_args__ = {'extend_existing': True} # --- NEW: Allows model merging ---

    # --- UPDATED: Changed from Text to Integer to match database/models.py and prevent crashes ---
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
    payment_progress = Column(Integer)

    renewal_type = Column(Text)
    notice_period = Column(Text)
    auto_renewal = Column(Text)

    created_on = Column(Text)
    effective_date = Column(Text)
    expiry_date = Column(Text)
    renewal_reminder = Column(Text)

    documents = Column(Integer)
    obligations = Column(Integer)
    tasks = Column(Integer)