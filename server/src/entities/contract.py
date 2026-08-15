from sqlalchemy import Column, Integer, String

from src.database.core import Base

class Contract(BaseModel):
    id: int
    name: str
    party: str
    category: str
    value: float
    owner: str
    status: str
    compliance: int
    renewal: str

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    owner = Column(String, nullable=False)
    status = Column(String, nullable=False)
    expiry = Column(String, nullable=False)