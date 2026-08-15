from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.database.core import get_db
from src.contract_repository.models import Contract

router = APIRouter(prefix="/public", tags=["Public"])

@router.get("/stats")
def get_public_stats(db: Session = Depends(get_db)):
    try:
        total_contracts = db.query(func.count(Contract.id)).scalar() or 0
        total_value = db.query(func.sum(Contract.contract_value)).scalar() or 0
        total_value_in_millions = total_value / 1_000_000
        
        return {
            "totalContracts": total_contracts,
            "totalValue": total_value_in_millions,
            "executionSpeed": 73,
            "complianceScore": 99.9
        }
    except Exception as e:
        return {
            "totalContracts": 0,
            "totalValue": 0,
            "executionSpeed": 73,
            "complianceScore": 99.9
        }
