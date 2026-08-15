from fastapi import APIRouter, Depends

from src.database.core import get_db

from .service import service

router = APIRouter(
    prefix="/compliance",
    tags=["AI Compliance Guardian"],
)


@router.get("/dashboard")
def get_dashboard(db=Depends(get_db)):
    """
    Returns AI Compliance Guardian dashboard data.
    """
    return service.dashboard(db)