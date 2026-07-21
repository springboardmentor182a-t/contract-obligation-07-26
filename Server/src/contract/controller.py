from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session


from database.core import get_db
from entities.contract import Contract
from entities.user import User
from users.service import admin_required
from auth.service import verify_token

router = APIRouter(
    prefix="/contract",
    tags=["Contract"],
)


@router.get("/contracts")
def get_notifications(
    payload: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")

    contracts = db.query(Contract).filter().all()

    return contracts


@router.get("/contract/{contract_id}")
def get_notifications(
    contract_id: int,
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")

    contract = db.query(Contract).filter(Contract.contract_id == contract_id).first()

    return contract
