from sqlalchemy import Column, Integer, String, Float, Date
from src.database.core import Base


class Renewal(Base):
    __tablename__ = "renewals"

    id = Column(Integer, primary_key=True, index=True)

    contract_name = Column(String, nullable=False)
    vendor = Column(String, nullable=False)
    department = Column(String)

    renewal_date = Column(Date)
    expiry_date = Column(Date)

    status = Column(String)

    approval_status = Column(String)

    contract_value = Column(Float)

    confidence = Column(Integer)

    recommendation = Column(String)