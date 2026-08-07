import os
from sqlalchemy.orm import Session
from fastapi import UploadFile
from src.entities.contract import Contract
from src.contracts.models import ContractCreate, ContractUpdate


def get_contracts(db: Session, search: str = None, status: str = None):
    """Fetch contracts with optional search and status filtering."""
    query = db.query(Contract).filter(Contract.archived == False)

    if search:
        query = query.filter(
            Contract.title.ilike(f"%{search}%")
        )

    if status:
        query = query.filter(
            Contract.status == status
        )

    return query.order_by(Contract.contract_id.desc()).all()


def get_contract_by_id(db: Session, contract_id: int):
    """Fetch a single contract by its ID."""
    return db.query(Contract).filter(
        Contract.contract_id == contract_id
    ).first()


def create_contract(db: Session, contract: ContractCreate):
    """Create a new contract record."""
    new_contract = Contract(
        **contract.model_dump()
    )

    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)

    return new_contract


def update_contract(db: Session, contract_id: int, data: ContractUpdate):
    """Update an existing contract with partial data."""
    contract = get_contract_by_id(db, contract_id)

    if not contract:
        return None

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(contract, key, value)

    db.commit()
    db.refresh(contract)

    return contract


def delete_contract(db: Session, contract_id: int):
    """Delete a contract by its ID."""
    contract = get_contract_by_id(db, contract_id)

    if not contract:
        return False

    db.delete(contract)
    db.commit()

    return True


def search_contract(db: Session, keyword: str):
    """Search contracts by title keyword."""
    return db.query(Contract).filter(
        Contract.archived == False,
        Contract.title.ilike(f"%{keyword}%")
    ).all()


def filter_status(db: Session, status: str):
    """Filter contracts by status."""
    return db.query(Contract).filter(
        Contract.archived == False,
        Contract.status == status
    ).all()


def get_archived_contracts(db: Session):
    """Fetch all archived contracts."""
    return db.query(Contract).filter(
        Contract.archived == True
    ).order_by(Contract.contract_id.desc()).all()


def archive_contract(db: Session, contract_id: int):
    """Archive a contract (soft delete)."""
    contract = get_contract_by_id(db, contract_id)

    if not contract:
        return None

    contract.archived = True
    db.commit()
    db.refresh(contract)

    return contract


def restore_contract(db: Session, contract_id: int):
    """Restore an archived contract."""
    contract = db.query(Contract).filter(
        Contract.contract_id == contract_id
    ).first()

    if not contract:
        return None

    contract.archived = False
    db.commit()
    db.refresh(contract)

    return contract


def upload_contract_file(db: Session, contract_id: int, file: UploadFile):
    """Upload a PDF file for a contract."""
    contract = get_contract_by_id(db, contract_id)

    if not contract:
        return None

    upload_dir = "uploads/contracts"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = os.path.join(upload_dir, f"{contract_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
        
    contract.file_path = file_path
    db.commit()
    db.refresh(contract)
    
    return contract