# server/src/renewals/controller.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database.core import SessionLocal
from src.entities.renewal import RenewalItem
from src.renewals.models import RenewalResponse

router = APIRouter(prefix="/api/renewals", tags=["Renewals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[RenewalResponse])
def get_renewals(db: Session = Depends(get_db)):
    return db.query(RenewalItem).all()