# server/src/entities/compliance.py
from sqlalchemy import Column, Integer, String, Date
from src.database.core import Base

class ComplianceItem(Base):
    __tablename__ = "compliance_items"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String, index=True)
    item_name = Column(String)
    description = Column(String)
    obligation = Column(String)
    status = Column(String)
    risk_level = Column(String)
    last_review = Column(Date, nullable=True)
    next_review = Column(Date)
    owner_img = Column(String)