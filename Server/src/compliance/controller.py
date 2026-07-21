from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session


from database.core import get_db
from entities.compliance import Compliance
from entities.user import User
from users.service import admin_required
from auth.service import verify_token
from compliance.models import ComplianceRecordResponse

router = APIRouter(
    prefix="/compliance",
    tags=["Compliance"],
)


@router.get("/compliances", response_model=list[ComplianceRecordResponse])
def get_notifications(
    payload: dict = Depends(verify_token), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == payload["sub"]).first()

    if not user:
        raise HTTPException(404, "User not exist!!")

    compliances = db.query(Compliance).filter().all()

    return compliances
