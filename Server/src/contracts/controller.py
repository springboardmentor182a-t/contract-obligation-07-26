from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.contracts import service
from src.contracts.models import (
    ContractCreate,
    ContractUpdate,
    ContractResponse
)

# Define the router with the basic contracts prefix.
router = APIRouter(
    prefix="/contracts",
    tags=["Contracts"],
    redirect_slashes=False
)

# 1. CREATE CONTRACT (POST -> http://127.0.0.1:8000/api/contracts)
@router.post(
    "", 
    response_model=ContractResponse
)
def create(
    contract: ContractCreate,
    db: Session = Depends(get_db)
):
    return service.create_contract(db, contract)


# 2. READ ALL CONTRACTS (GET -> http://127.0.0.1:8000/api/contracts)
# Handles searching and status filtering cleanly via query parameters
@router.get(
    "", 
    response_model=list[ContractResponse]
)
def get_all(
    search: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return service.get_contracts(
        db=db,
        search=search,
        status=status
    )


# 3. READ SINGLE CONTRACT (GET -> http://127.0.0.1:8000/api/contracts/{id})
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


# 4. UPDATE CONTRACT (PUT -> http://127.0.0.1:8000/api/contracts/{id})
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


# 5. DELETE CONTRACT (DELETE -> http://127.0.0.1:8000/api/contracts/{id})
@router.delete(
    "/{id}"
)
def delete(
    id: int,
    db: Session = Depends(get_db)
):
    success = service.delete_contract(db, id)
    if not success:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )
    return {
        "message": "Contract deleted successfully"
    }