from fastapi import APIRouter, HTTPException
from src.contracts.service import (
    get_all_contracts,
    get_contract_by_id,
    create_contract,
    update_contract,
    delete_contract,
)
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

    return contract


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