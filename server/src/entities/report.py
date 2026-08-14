from sqlalchemy import Column, Integer, String
from src.database.core import Base


class Report(Base):

    __tablename__ = "reports"

    id = Column(Integer, primary_key=True)

    report_name = Column(String(100))

    generated_by = Column(String(100))