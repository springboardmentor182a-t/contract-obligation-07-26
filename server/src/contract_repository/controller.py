from pathlib import Path
from uuid import uuid4
import shutil
from datetime import datetime
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    status,
)
from src.audit.service import create_audit_log
from src.auth.dependencies import CONTRACT_ROLES, require_roles
from fastapi.responses import FileResponse
from sqlalchemy import select
from typing import List
from src.database.core import get_db
from src.contract_repository.models import (
    Contract,
    ContractDocument,
)
from src.contract_repository.schemas import (
    ContractCreate,
    ContractUpdate,
    ContractResponse,
    ContractDocumentResponse,
    ContractDocumentListResponse,
    DocumentUploadResponse,
)

router = APIRouter(
    prefix="/contracts",
    tags=["Contract Repository"],
    dependencies=[Depends(require_roles(*CONTRACT_ROLES))],
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
    create_audit_log(
        db=db,
        user_id=None,
        event_type="CREATE",
        action="Contract Created",
        module="Contract Repository",
        description=f"Created contract: {contract.contract_name}",
  )

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

    previous_status = contract.status
    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(contract, key, value)

    # Update timestamp whenever a contract is modified
    contract.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(contract)

    status_changed = (
        "status" in update_data
        and previous_status != contract.status
    )
    normalized_status = (contract.status or "").strip().lower()

    if status_changed and normalized_status == "approved":
        event_type = "APPROVE"
        action = "Contract Approved"
        description = (
            f"Approved contract: {contract.contract_name} "
            f"(ID: {contract.id}, previous status: {previous_status})"
        )
    elif status_changed and normalized_status == "rejected":
        event_type = "REJECT"
        action = "Contract Rejected"
        description = (
            f"Rejected contract: {contract.contract_name} "
            f"(ID: {contract.id}, previous status: {previous_status})"
        )
    else:
        event_type = "UPDATE"
        action = "Contract Updated"
        description = f"Updated contract: {contract.contract_name}"

    create_audit_log(
        db=db,
        user_id=None,
        event_type=event_type,
        action=action,
        module="Contract Repository",
        description=description,
    )

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
    contract_name = contract.contract_name
    db.delete(contract)
    db.commit()

    create_audit_log(
        db=db,
        user_id=None,
        event_type="DELETE",
        action="Contract Deleted",
        module="Contract Repository",
        description=f"Deleted contract: {contract_name}",
    )

    return {
        "message": "Contract deleted successfully"
    }
@router.post(
    "/{contract_id}/documents",
    response_model=DocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
def upload_document(
    contract_id: int,
    file: UploadFile = File(...),
    db=Depends(get_db),
):
    # Check contract exists
    result = db.execute(
        select(Contract).where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )

    # Allow only PDF and DOCX
    allowed_extensions = [".pdf", ".docx"]

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed.",
        )

    # Maximum file size (10 MB)
    content = file.file.read()

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="File size should not exceed 10 MB.",
        )

    # Create contract folder
    upload_dir = Path("uploads") / "contracts" / str(contract_id)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename
    unique_name = f"{uuid4().hex}{extension}"

    file_path = upload_dir / unique_name

    with open(file_path, "wb") as buffer:
        buffer.write(content)

    # Save metadata
    document = ContractDocument(
        contract_id=contract_id,
        file_name=unique_name,
        original_name=file.filename,
        file_type=file.content_type,
        file_size=len(content),
        file_path=str(file_path),
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    create_audit_log(
        db=db,
        user_id=None,
        event_type="CREATE",
        action="Contract Document Uploaded",
        module="Contract Repository",
        description=(
            f"Uploaded document: {document.original_name} "
            f"to contract: {contract.contract_name} "
            f"(ID: {contract.id})"
        ),
    )

    return {
        "message": "Document uploaded successfully.",
        "document": document,
    }
@router.get(
    "/{contract_id}/documents",
    response_model=List[ContractDocumentResponse],
)
def list_documents(
    contract_id: int,
    db=Depends(get_db),
):
    # Check contract exists
    result = db.execute(
        select(Contract).where(Contract.id == contract_id)
    )
    contract = result.scalar_one_or_none()

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found",
        )

    # Fetch all documents for the contract
    result = db.execute(
        select(ContractDocument).where(
            ContractDocument.contract_id == contract_id
        )
    )

    documents = result.scalars().all()

    return documents
@router.get("/documents/{document_id}/download")
def download_document(
    document_id: int,
    db=Depends(get_db),
):
    result = db.execute(
        select(ContractDocument).where(
            ContractDocument.id == document_id
        )
    )

    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    file_path = Path(document.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found on server",
        )

    return FileResponse(
        path=file_path,
        filename=document.original_name,
        media_type=document.file_type,
    )
@router.get("/documents/{document_id}/preview")
def preview_document(
    document_id: int,
    db=Depends(get_db),
):
    result = db.execute(
        select(ContractDocument).where(
            ContractDocument.id == document_id
        )
    )

    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    file_path = Path(document.file_path)

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File not found on server",
        )

    return FileResponse(
        path=file_path,
        media_type=document.file_type,
        headers={
            "Content-Disposition": f'inline; filename="{document.original_name}"'
        },
    )
@router.delete("/documents/{document_id}")
def delete_document(
    document_id: int,
    db=Depends(get_db),
):
    result = db.execute(
        select(ContractDocument).where(
            ContractDocument.id == document_id
        )
    )

    document = result.scalar_one_or_none()

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found",
        )

    original_name = document.original_name
    contract_id = document.contract_id
    file_path = Path(document.file_path)

    if file_path.exists():
        file_path.unlink()

    db.delete(document)
    db.commit()

    create_audit_log(
        db=db,
        user_id=None,
        event_type="DELETE",
        action="Contract Document Deleted",
        module="Contract Repository",
        description=(
            f"Deleted document: {original_name} "
            f"from contract ID: {contract_id}"
        ),
    )

    return {
        "message": "Document deleted successfully"
    }
