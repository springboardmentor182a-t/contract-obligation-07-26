from src.database.core import SessionLocal
from src.contracts.models import ContractModel
from src.entities.contract import Contract


def get_all_contracts():
    db = SessionLocal()

    try:
        return db.query(ContractModel).all()
    finally:
        db.close()


def get_contract_by_id(contract_id: str):
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


def update_contract(contract_id: str, updated_contract: Contract):
    db = SessionLocal()

    try:
        contract = (
            db.query(ContractModel)
            .filter(ContractModel.id == contract_id)
            .first()
        )

        if not contract:
            return None

        data = updated_contract.model_dump()

        for key, value in data.items():
            setattr(contract, key, value)

        db.commit()
        db.refresh(contract)

        return contract

    finally:
        db.close()


def delete_contract(contract_id: str):
    db = SessionLocal()

    try:
        contract = (
            db.query(ContractModel)
            .filter(ContractModel.id == contract_id)
            .first()
        )

        if not contract:
            return None

        db.delete(contract)
        db.commit()

        return {"message": "Contract deleted successfully"}

    finally:
        db.close()