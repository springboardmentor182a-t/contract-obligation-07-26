from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import get_db

from .schemas import ContractInsightsResponse
from .service import InsightsService


router = APIRouter(
    prefix="/insights",
    tags=["AI Contract Insights"],
)


@router.get(
    "/{contract_id}",
    response_model=ContractInsightsResponse,
)
def get_contract_insights(
    contract_id: int,
    db: Session = Depends(get_db),
):
    return InsightsService.get_insights(
        db=db,
        contract_id=contract_id,
    )
