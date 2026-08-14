from sqlalchemy import Column, Integer, String, Date, ForeignKey
from src.database.core import Base


class Obligation(Base):

    __tablename__ = "obligations"

    id = Column(Integer, primary_key=True)

    contract_id = Column(Integer, ForeignKey("contracts.id"))

    obligation_type = Column(String(100))

    description = Column(String(255))

    due_date = Column(Date)

    status = Column(String(50))