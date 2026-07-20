from sqlalchemy.orm import Session

from src.entities.contract import Contract
from src.contracts.models import ContractCreate


def get_contracts(db: Session):
    return db.query(Contract).all()


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