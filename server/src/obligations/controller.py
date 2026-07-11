# server/src/obligations/controller.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from src.database.core import SessionLocal
from src.entities.obligation import ObligationItem
from src.obligations.models import ObligationResponse

router = APIRouter(prefix="/api/obligations", tags=["Obligations"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[ObligationResponse])
def get_obligations(db: Session = Depends(get_db)):
    return db.query(ObligationItem).all()