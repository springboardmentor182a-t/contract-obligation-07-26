from src.database.core import mock_db
from datetime import datetime
from src.contracts.models import ContractCreate

def get_all_contracts():
    return mock_db["contracts"]

def create_contract(data: ContractCreate):
    new_contract = data.dict()
    new_contract["date"] = datetime.now().strftime("%b %d, %Y")
    mock_db["contracts"].append(new_contract)
    return new_contract
