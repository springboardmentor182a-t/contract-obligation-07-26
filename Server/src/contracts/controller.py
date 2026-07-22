from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.contracts import service
from src.contracts.models import (
    ContractCreate,
    ContractUpdate,
    ContractResponse
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"]
)


@router.post(
    "/",
    response_model=ContractResponse
)
def create(
    contract: ContractCreate,
    db: Session = Depends(get_db)
):
    return service.create_contract(db, contract)


@router.get(
    "/",
    response_model=list[ContractResponse]
)
def get_all(
    db: Session = Depends(get_db)
):
    return service.get_contracts(db)


@router.get(
    "/{id}",
    response_model=ContractResponse
)
def get_one(
    id: int,
    db: Session = Depends(get_db)
):
    contract = service.get_contract_by_id(db, id)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return contract


@router.put(
    "/{id}",
    response_model=ContractResponse
)
def update(
    id: int,
    data: ContractUpdate,
    db: Session = Depends(get_db)
):
    contract = service.update_contract(db, id, data)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return contract


@router.delete("/{id}")
def delete(
    id: int,
    db: Session = Depends(get_db)
):
    contract = service.delete_contract(db, id)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    return {
        "message": "Contract deleted successfully"
    }


@router.get("/search/{keyword}")
def search(
    keyword: str,
    db: Session = Depends(get_db)
):
    return service.search_contract(db, keyword)


@router.get("/status/{status}")
def status_filter(
    status: str,
    db: Session = Depends(get_db)
):
    return service.filter_status(db, status)