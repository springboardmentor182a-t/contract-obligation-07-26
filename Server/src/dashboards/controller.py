from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.database.core import get_db
from src.dashboards.service import DashboardService
from src.auth.service import verify_token

router = APIRouter(prefix="/dashboards", tags=["Dashboards"])


@router.get("/admin")
def get_admin_dashboard(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    return DashboardService.get_admin_dashboard(db)


@router.get("/legal-manager")
def get_legal_manager_dashboard(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    return DashboardService.get_legal_manager_dashboard(db)


@router.get("/compliance-officer")
def get_compliance_officer_dashboard(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    return DashboardService.get_compliance_officer_dashboard(db)


@router.get("/contract-manager")
def get_contract_manager_dashboard(
    current_user: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    return DashboardService.get_contract_manager_dashboard(
        db,
        user_id=current_user["user_id"],
    )