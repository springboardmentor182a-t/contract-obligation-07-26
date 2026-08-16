from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import Obligation

router = APIRouter()

@router.get("/")
def get_obligations(db: Session = Depends(get_db)):
    from src.database.models import Contract
    obligations = db.query(Obligation, Contract).join(Contract, Obligation.contract_id == Contract.id).all()
    # Map DB fields to what frontend expects
    return [
        {
            "id": obl.id,
            "contract": contract.vendor,
            "description": obl.description,
            "dueDate": obl.dueDate.strftime("%b %d, %Y") if obl.dueDate else "",
            "status": obl.status,
            "priority": obl.priority
        } for obl, contract in obligations
    ]
