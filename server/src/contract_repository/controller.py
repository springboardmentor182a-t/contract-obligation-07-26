from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from src.database.core import get_db
from src.contract_repository.models import Contract
from src.contract_repository.schemas import (
    ContractCreate,
    ContractUpdate,
    ContractResponse,
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contract Repository"],
)


@router.get("", response_model=List[ContractResponse])
def list_contracts(db=Depends(get_db)):
    result = db.execute(select(Contract))
    return result.scalars().all()


@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(
    contract_id: int,
    db=Depends(get_db),
):
    result = db.execute(
        select(Contract).where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )

    return contract


@router.post(
    "",
    response_model=ContractResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_contract(
    payload: ContractCreate,
    db=Depends(get_db),
):
    contract = Contract(**payload.model_dump())

    db.add(contract)
    db.commit()
    db.refresh(contract)

    return contract


@router.put("/{contract_id}", response_model=ContractResponse)
def update_contract(
    contract_id: int,
    payload: ContractUpdate,
    db=Depends(get_db),
):
    result = db.execute(
        select(Contract).where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(contract, key, value)

    db.commit()
    db.refresh(contract)

    return contract


@router.delete("/{contract_id}")
def delete_contract(
    contract_id: int,
    db=Depends(get_db),
):
    result = db.execute(
        select(Contract).where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )

    db.delete(contract)
    db.commit()

    return {
        "message": "Contract deleted successfully"
    }