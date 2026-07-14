from sqlalchemy import Column, Integer, Date, String, ForeignKey
from src.database.core import Base


class Renewal(Base):

    __tablename__ = "renewals"

    id = Column(Integer, primary_key=True)

    contract_id = Column(Integer, ForeignKey("contracts.id"))

    renewal_date = Column(Date)

    status = Column(String(50))