
from fastapi import APIRouter, HTTPException

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


from src.contracts.models import ContractUpdate


router = APIRouter()

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
)


@router.get("/contracts/{contract_id}")
def get_contract(contract_id: int):
    contract = get_contract_by_id(contract_id)


@router.get("/")
def fetch_contracts(db: Session = Depends(get_db)):
    return get_contracts(db)


@router.post("/")
def add_contract(
    data: ContractCreate,
    db: Session = Depends(get_db),
):
    return create_contract(db, data)


@router.put("/contracts/{contract_id}")
def edit_contract(contract_id: int, contract: ContractUpdate):
    updated = update_contract(contract_id, contract)

    if not contract:
        return {
            "success": False,
            "message": "Contract not found",
        }

    return contract


@router.delete("/contracts/{contract_id}")
def remove_contract(contract_id: int):
    deleted = delete_contract(contract_id)
@router.put("/{contract_id}")
def edit_contract(
    contract_id: int,
    data: ContractCreate,
    db: Session = Depends(get_db),
):
    return update_contract(db, contract_id, data)


    return deleted

@router.delete("/{contract_id}")
def remove_contract(
    contract_id: int,
    db: Session = Depends(get_db),
):
    return delete_contract(db, contract_id)
