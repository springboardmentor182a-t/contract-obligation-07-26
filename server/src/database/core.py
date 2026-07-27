import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./contractiq.db")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dummy database
mock_db = {
    "contracts": [
        {"id": "CTR-2026-001", "vendor": "Acme Corp", "type": "NDA", "status": "Active", "value": "$50,000", "owner": "Jane Doe", "date": "Jul 12, 2026"},
        {"id": "CTR-2026-002", "vendor": "TechFlow Inc", "type": "MSA", "status": "Pending", "value": "$120,000", "owner": "John Smith", "date": "Jul 10, 2026"},
        {"id": "CTR-2026-003", "vendor": "Global Logistics", "type": "SLA", "status": "Active", "value": "$85,000", "owner": "Jane Doe", "date": "Jul 05, 2026"},
        {"id": "CTR-2026-004", "vendor": "CloudSystems", "type": "Vendor", "status": "Expired", "value": "$10,000", "owner": "Alice Wong", "date": "Jun 28, 2026"},
        {"id": "CTR-2026-005", "vendor": "Marketing Pros", "type": "NDA", "status": "Active", "value": "$25,000", "owner": "John Smith", "date": "Jun 15, 2026"}
    ],
    "users": []
}
