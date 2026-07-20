from sqlalchemy import Column, Integer, String, Date, Float, Boolean, DateTime
from .core import Base

# -----------------------------
# Activity Model
# -----------------------------
class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    time = Column(String)


# -----------------------------
# Deadline Model
# -----------------------------
class Deadline(Base):
    __tablename__ = "deadlines"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(String)


# -----------------------------
# Compliance Model
# -----------------------------
class ComplianceItem(Base):
    __tablename__ = "compliance_items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String)
    description = Column(String)
    contract_ref = Column(String)
    obligation = Column(String)
    status = Column(String)
    risk_level = Column(String)
    last_review = Column(Date, nullable=True)
    next_review = Column(Date)
    owner_name = Column(String)


# -----------------------------
# User Model
# -----------------------------
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    department = Column(String)
    role = Column(String)
    status = Column(String)
    phone = Column(String)

    date_joined = Column(Date)
    last_login = Column(DateTime)