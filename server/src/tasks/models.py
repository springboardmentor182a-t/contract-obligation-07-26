from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

from src.database.core import Base


# SQLAlchemy Model
class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    contract_id = Column(Integer)

    related_contract = Column(String(50))
    company = Column(String(100))

    assigned_to = Column(String(100))
    due_date = Column(Date)
    priority = Column(String(20))
    status = Column(String(20))

    progress = Column(Integer, default=0)

    created_at = Column(DateTime)
    updated_at = Column(DateTime)


# Pydantic Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    contract_id: Optional[int] = None

    related_contract: Optional[str] = None
    company: Optional[str] = None

    assigned_to: Optional[str] = None
    due_date: Optional[date] = None
    priority: Optional[str] = None
    status: Optional[str] = None

    progress: Optional[int] = 0


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True