from sqlalchemy import (
    Column,
    Date,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from src.database.core import Base


class Renewal(Base):
    __tablename__ = "renewals"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    contract_id = Column(
        Integer,
        ForeignKey(
            "public.contracts.id",
            ondelete="CASCADE",
        ),
        nullable=True,
        index=True,
    )

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

    contract = relationship(
        "Contract",
        backref="renewals",
    )