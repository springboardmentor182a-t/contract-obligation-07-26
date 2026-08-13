from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from src.database.core import get_db
from src.database.models import User, ObligationModel
from src.contract_repository.models import Contract

router = APIRouter(prefix="/public", tags=["Public"])

@router.get("/stats")
def get_public_stats(db: Session = Depends(get_db)):
    # Total Users
    total_users = db.query(func.count(User.id)).scalar() or 0
    
    # Active Contracts
    active_contracts = db.query(func.count(Contract.id)).filter(Contract.status == "Active").scalar() or 0
    
    # Obligations Fulfilled
    obligations_fulfilled = db.query(func.count(ObligationModel.id)).filter(ObligationModel.status == "Completed").scalar() or 0
    
    # Total Contract Value
    total_value = db.query(func.sum(Contract.contract_value)).scalar() or 0.0

    return {
        "total_users": total_users,
        "active_contracts": active_contracts,
        "obligations_fulfilled": obligations_fulfilled,
        "total_contract_value": float(total_value)
    }
