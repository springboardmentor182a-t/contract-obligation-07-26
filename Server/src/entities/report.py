from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database.core import Base


class Report(Base):
    __tablename__ = "reports"

    report_id = Column(Integer, primary_key=True)
    report_name = Column(String(255))
    report_type = Column(String(100))
    generated_by = Column(Integer, ForeignKey("users.user_id"))
    file_path = Column(String(500))
    format = Column(String(20))
    create_at = Column(DateTime(timezone=True), server_default=func.now())
