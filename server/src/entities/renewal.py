# server/src/entities/renewal.py
from sqlalchemy import Column, Integer, String, Date
from src.database.core import Base

class RenewalItem(Base):
    __tablename__ = "renewals"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String, index=True)
    status = Column(String)
    expiry_date = Column(Date)
    renewal_date = Column(Date)
    owner = Column(String)