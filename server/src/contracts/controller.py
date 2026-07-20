from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import SessionLocal
from src.entities.contract import Contract
from src.contracts.models import ContractCreate
from src.contracts.service import (
    get_contracts,
    create_contract,
    update_contract,
    delete_contract,
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def fetch_contracts(db: Session = Depends(get_db)):
    return get_contracts(db)


@router.post("/")
def add_contract(
    data: ContractCreate,
    db: Session = Depends(get_db),
):
    return create_contract(db, data)


@router.get("/{contract_id}")
def fetch_contract(
    contract_id: int,
    db: Session = Depends(get_db),
):
    contract = (
        db.query(Contract)
        .filter(Contract.id == contract_id)
        .first()
    )

    if not contract:
        return {
            "success": False,
            "message": "Contract not found",
        }

    return contract


@router.put("/{contract_id}")
def edit_contract(
    contract_id: int,
    data: ContractCreate,
    db: Session = Depends(get_db),
):
    return update_contract(db, contract_id, data)


@router.delete("/{contract_id}")
def remove_contract(
    contract_id: int,
    db: Session = Depends(get_db),
):
    return delete_contract(db, contract_id)