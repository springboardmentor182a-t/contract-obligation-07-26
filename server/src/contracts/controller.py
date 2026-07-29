<<<<<<< HEAD
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import SessionLocal
from src.entities.contract import Contract
from src.contracts.models import ContractCreate
from src.contracts.service import (
    get_contracts,
=======
from fastapi import APIRouter, HTTPException
from src.contracts.service import (
    get_all_contracts,
    get_contract_by_id,
>>>>>>> origin/main-group-D
    create_contract,
    update_contract,
    delete_contract,
)
<<<<<<< HEAD

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
=======
from src.entities.contract import Contract

router = APIRouter()


@router.get("/contracts")
def get_contracts():
    return get_all_contracts()


@router.get("/contracts/{contract_id}")
def get_contract(contract_id: str):
    contract = get_contract_by_id(contract_id)

    if contract is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )
>>>>>>> origin/main-group-D

    return contract


<<<<<<< HEAD
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
=======
@router.post("/contracts")
def add_contract(contract: Contract):
    return create_contract(contract)


@router.put("/contracts/{contract_id}")
def edit_contract(contract_id: str, contract: Contract):
    updated = update_contract(contract_id, contract)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return updated


@router.delete("/contracts/{contract_id}")
def remove_contract(contract_id: str):
    deleted = delete_contract(contract_id)

    if deleted is None:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return deleted
>>>>>>> origin/main-group-D
