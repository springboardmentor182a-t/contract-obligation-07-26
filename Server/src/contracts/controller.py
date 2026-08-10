from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional

from src.contracts.contractssummary import summarize_contract
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


@router.get(
    "/",
    response_model=list[ContractResponse]
)
def get_all(
    search: Optional[str] = Query(None, description="Search contracts by title"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    """Get all contracts with optional search and status filtering."""
    return service.get_contracts(db, search=search, status=status)


@router.get(
    "/archived",
    response_model=list[ContractResponse]
)
def get_archived(
    db: Session = Depends(get_db)
):
    """Get all archived contracts."""
    return service.get_archived_contracts(db)


@router.get(
    "/search/{keyword}",
    response_model=list[ContractResponse]
)
def search(
    keyword: str,
    db: Session = Depends(get_db)
):
    """Search contracts by title keyword."""
    return service.search_contract(db, keyword)


@router.get(
    "/status/{status}",
    response_model=list[ContractResponse]
)
def status_filter(
    status: str,
    db: Session = Depends(get_db)
):
    """Filter contracts by status."""
    return service.filter_status(db, status)


@router.get(
    "/{contract_id}",
    response_model=ContractResponse
)
def get_one(
    contract_id: int,
    db: Session = Depends(get_db)
):
    """Get a single contract by ID."""
    contract = service.get_contract_by_id(db, contract_id)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    return contract


@router.post(
    "/",
    response_model=ContractResponse,
    status_code=201
)
def create(
    contract: ContractCreate,
    db: Session = Depends(get_db)
):
    """Create a new contract."""
    try:
        return service.create_contract(db, contract)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to create contract: {str(e)}"
        )


@router.put(
    "/{contract_id}",
    response_model=ContractResponse
)
def update(
    contract_id: int,
    data: ContractUpdate,
    db: Session = Depends(get_db)
):
    """Update an existing contract."""
    contract = service.update_contract(db, contract_id, data)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    return contract


@router.delete("/{contract_id}")
def delete(
    contract_id: int,
    db: Session = Depends(get_db)
):
    """Delete a contract."""
    success = service.delete_contract(db, contract_id)

    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    return {
        "message": "Contract deleted successfully"
    }


@router.put(
    "/{contract_id}/archive",
    response_model=ContractResponse
)
def archive(
    contract_id: int,
    db: Session = Depends(get_db)
):
    """Archive a contract."""
    contract = service.archive_contract(db, contract_id)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    return contract


@router.put(
    "/{contract_id}/restore",
    response_model=ContractResponse
)
def restore(
    contract_id: int,
    db: Session = Depends(get_db)
):
    """Restore an archived contract."""
    contract = service.restore_contract(db, contract_id)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    return contract


@router.post(
    "/{contract_id}/upload",
    response_model=ContractResponse
)
def upload_file(
    contract_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload a PDF file for a contract."""
    contract = service.upload_contract_file(db, contract_id, file)

    if not contract:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    return contract


@router.get("/{contract_id}/summary")
def contract_summary(
    contract_id: int,
    db: Session = Depends(get_db)
):
    """
    Generate AI summary using both
    database contract data and uploaded PDF.
    """

    contract = service.get_contract_by_id(
        db,
        contract_id
    )

    if not contract:
        raise HTTPException(
            status_code=404,
            detail=f"Contract with ID {contract_id} not found"
        )

    if not contract.file_path:
        raise HTTPException(
            status_code=400,
            detail="No PDF file uploaded for this contract"
        )

    try:

        summary = summarize_contract(contract)

        return {
            "contract_id": contract.contract_id,
            "title": contract.title,
            "summary": summary
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate contract summary: {str(e)}"
        )