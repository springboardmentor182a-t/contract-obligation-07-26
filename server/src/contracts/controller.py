# server/src/contracts/controller.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database.core import SessionLocal
from src.entities.contract import ContractItem
from src.contracts.models import ContractResponse

router = APIRouter(prefix="/api/contracts", tags=["Contracts"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ContractResponse])
def get_contracts(db: Session = Depends(get_db)):
    return db.query(ContractItem).all()