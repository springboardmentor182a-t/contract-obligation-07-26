from sqlalchemy import Column, Integer, String
from pydantic import BaseModel
from src.database.core import Base

# SQLAlchemy ORM Model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="User")
    is_active = Column(Integer, default=1)
    reset_token = Column(String, nullable=True)

# Pydantic Schemas
class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: str
    password: str
