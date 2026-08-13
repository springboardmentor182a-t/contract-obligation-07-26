from sqlalchemy import Column, Integer, Text
from src.database.core import Base

class RenewalModel(Base):
    __tablename__ = "renewals"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True)

    contract_name = Column(Text)
    renewal_type = Column(Text)
    renewal_date = Column(Text)
    reminder_days = Column(Integer)
    status = Column(Text)