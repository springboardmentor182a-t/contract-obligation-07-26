from sqlalchemy import Column, Integer, String, Date, Float
from .core import Base

class Contract(Base):
    __tablename__ = "contracts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    party = Column(String)
    status = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    value = Column(Float)

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

# --- NEW: The ComplianceItem model that Python is looking for! ---
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