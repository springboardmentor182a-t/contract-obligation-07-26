from src.database.core import SessionLocal
from src.contracts.models import ContractModel, ContractUpdate
from src.entities.contract import Contract

def get_all_contracts():
    db = SessionLocal()

    try:
        return db.query(ContractModel).all()
    finally:
        db.close()


def get_contract_by_id(contract_id: int):
    db = SessionLocal()

    try:
        return (
            db.query(ContractModel)
            .filter(ContractModel.id == contract_id)
            .first()
        )
    finally:
        db.close()


def create_contract(contract: Contract):
    db = SessionLocal()

    try:
        db_contract = ContractModel(**contract.model_dump())

        db.add(db_contract)
        db.commit()
        db.refresh(db_contract)

        return db_contract

    finally:
        db.close()
from sqlalchemy.orm import Session

from src.entities.contract import Contract
from src.contracts.models import ContractCreate


def get_contracts(db: Session):
    return db.query(Contract).all()

def update_contract(contract_id: int, updated_contract: ContractUpdate):
    db = SessionLocal()

def create_contract(db: Session, data: ContractCreate):
    contract = Contract(
        title=data.title,
        owner=data.owner,
        status=data.status,
        expiry=data.expiry,
    )

    db.add(contract)
    db.commit()
    db.refresh(contract)

        data = updated_contract.model_dump(exclude_unset=True)
    return {
        "success": True,
        "message": "Contract created successfully",
        "contract": contract,
    }


def update_contract(db: Session, contract_id: int, data: ContractCreate):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()

    if not contract:
        return {
            "success": False,
            "message": "Contract not found",
        }

    contract.title = data.title
    contract.owner = data.owner
    contract.status = data.status
    contract.expiry = data.expiry

    db.commit()
    db.refresh(contract)

def delete_contract(contract_id: int):
    db = SessionLocal()
    return {
        "success": True,
        "message": "Contract updated successfully",
        "contract": contract,
    }


def delete_contract(db: Session, contract_id: int):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()

    if not contract:
        return {
            "success": False,
            "message": "Contract not found",
        }

    db.delete(contract)
    db.commit()

    return {
        "success": True,
        "message": "Contract deleted successfully",
    }