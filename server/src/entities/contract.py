# server/src/entities/contract.py
from sqlalchemy import Column, Integer, String, Date
from src.database.core import Base

class ContractItem(Base):
    __tablename__ = "contracts"
    
    id = Column(String, primary_key=True, index=True)
    title = Column(String)
    party = Column(String)
    status = Column(String)
    effective_date = Column(Date)
    expiry_date = Column(Date)