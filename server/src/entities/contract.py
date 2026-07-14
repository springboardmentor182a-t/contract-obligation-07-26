from sqlalchemy import Column, Integer, String, Date, ForeignKey
from src.database.core import Base


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    category = Column(String(100))
    status = Column(String(50))
    start_date = Column(Date)
    end_date = Column(Date)
    owner_id = Column(Integer, ForeignKey("users.id"))