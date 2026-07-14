# server/src/compliance/controller.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database.core import SessionLocal
from src.entities.compliance import ComplianceItem
from src.compliance.models import ComplianceResponse, ComplianceCreate

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ComplianceResponse])
def get_compliance_data(db: Session = Depends(get_db)):
    return db.query(ComplianceItem).all()

@router.post("/", response_model=ComplianceResponse)
def create_compliance_item(item: ComplianceCreate, db: Session = Depends(get_db)):
    db_item = ComplianceItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item