from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import Contract
from pydantic import BaseModel

router = APIRouter()

class ContractCreate(BaseModel):
    id: str
    vendor: str
    type: str
    status: str
    value: str
    owner: str

@router.get("/")
def get_contracts(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    return contracts

@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    total = db.query(Contract).count()
    active = db.query(Contract).filter(Contract.status == "Active").count()
    return {"total": total, "active": active}

@router.post("/", status_code=201)
def add_contract(data: ContractCreate, db: Session = Depends(get_db)):
    try:
        val_str = str(data.value).replace('$', '').replace(',', '').strip()
        val = float(val_str) if val_str else 0.0
    except ValueError:
        val = 0.0

    new_contract = Contract(
        contract_id=data.id,
        vendor=data.vendor,
        type=data.type,
        status=data.status,
        value=val,
        owner=data.owner
    )
    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)
    return new_contract
