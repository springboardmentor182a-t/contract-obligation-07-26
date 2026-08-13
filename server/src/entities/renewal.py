<<<<<<< HEAD
from sqlalchemy import Column, Integer, Date, String, ForeignKey
from src.database.core import Base


class Renewal(Base):

    __tablename__ = "renewals"

    id = Column(Integer, primary_key=True)

    contract_id = Column(Integer, ForeignKey("contracts.id"))

    renewal_date = Column(Date)

    status = Column(String(50))
=======


from pydantic import BaseModel
from typing import Optional
class Renewal(BaseModel):
    id: Optional[int] = None
    contract_name: str
    renewal_type: str
    renewal_date: str
    reminder_days: int
    status: str
>>>>>>> origin/main-group-D
