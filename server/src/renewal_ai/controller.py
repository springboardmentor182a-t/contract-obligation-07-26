from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import get_db

from .schemas import RenewalStrategyResponse
from .service import RenewalAIService


router = APIRouter(
    prefix="/renewal-ai",
    tags=["AI Renewal Strategy"],
)


@router.get(
    "/{contract_id}",
    response_model=RenewalStrategyResponse,
)
def get_renewal_strategy(
    contract_id: int,
    db: Session = Depends(get_db),
):
    return RenewalAIService.generate_strategy(
        db=db,
        contract_id=contract_id,
    )