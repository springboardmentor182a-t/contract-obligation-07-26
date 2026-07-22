from sqlalchemy.orm import Session
from src.entities.contract import Contract
from src.contracts.models import ContractCreate, ContractUpdate


def get_contracts(db: Session, search=None, status=None):
    query = db.query(Contract)

    if search:
        query = query.filter(
            Contract.title.ilike(f"%{search}%")
        )

    if status:
        query = query.filter(
            Contract.status == status
        )

    return query.all()

def create_contract(
        db: Session,
        contract: ContractCreate
):

    new_contract = Contract(
        **contract.model_dump()
    )

    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)

    return new_contract



def get_contracts(db: Session):

    return db.query(Contract).all()



def get_contract_by_id(
        db: Session,
        contract_id:int
):

    return db.query(Contract)\
        .filter(
            Contract.id == contract_id
        ).first()



def update_contract(
        db:Session,
        contract_id:int,
        data:ContractUpdate
):

    contract = get_contract_by_id(
        db,
        contract_id
    )

    if contract:

        for key,value in data.model_dump(
            exclude_unset=True
        ).items():

            setattr(
                contract,
                key,
                value
            )


        db.commit()
        db.refresh(contract)


    return contract



def delete_contract(
        db:Session,
        contract_id:int
):

    contract = get_contract_by_id(
        db,
        contract_id
    )

    if contract:

        db.delete(contract)
        db.commit()

        return True

    return False



def search_contract(
        db:Session,
        keyword:str
):

    return db.query(Contract)\
        .filter(
            Contract.title.ilike(
                f"%{keyword}%"
            )
        ).all()



def filter_status(
        db:Session,
        status:str
):

    return db.query(Contract)\
        .filter(
            Contract.status == status
        ).all()