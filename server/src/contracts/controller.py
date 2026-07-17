from fastapi import APIRouter
from src.contracts.service import get_all_contracts, create_contract
from src.contracts.models import ContractCreate

router = APIRouter()

@router.get("/")
def get_contracts():
    return get_all_contracts()

@router.post("/", status_code=201)
def add_contract(data: ContractCreate):
    return create_contract(data)
