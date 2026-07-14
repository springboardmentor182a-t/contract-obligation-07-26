# server/src/entities/obligation.py
from sqlalchemy import Column, Integer, String, Date, ForeignKey
from src.database.core import Base

class ObligationItem(Base):
    __tablename__ = "obligations"
    
    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(String, index=True)
    description = Column(String)
    assignee = Column(String)
    due_date = Column(Date)
    status = Column(String)