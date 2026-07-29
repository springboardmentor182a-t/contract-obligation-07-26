from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import Contract
from src.contracts.service import (
    get_all_contracts,
    get_compliance_dashboard,
    get_ai_recommendations,
    get_activity_chart,
    get_recent_activities,
    get_system_health,
)
from pydantic import BaseModel

router = APIRouter()


class ContractCreate(BaseModel):
    id: str
    vendor: str
    type: str
    status: str
    value: str
    owner: str


@router.get("/")
def get_contracts(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    return contracts


@router.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    total = db.query(Contract).count()
    active = db.query(Contract).filter(Contract.status == "Active").count()
    return {"total": total, "active": active}


@router.post("/", status_code=201)
def add_contract(data: ContractCreate, db: Session = Depends(get_db)):
    new_contract = Contract(
        contract_id=data.id,
        vendor=data.vendor,
        type=data.type,
        status=data.status,
        value=float(data.value) if data.value else 0.0,
        owner=data.owner,
    )
    db.add(new_contract)
    db.commit()
    db.refresh(new_contract)
    return new_contract


@router.get("/compliance")
def compliance_dashboard():
    return get_compliance_dashboard()


@router.get("/ai-recommendations")
def ai_recommendations():
    return get_ai_recommendations()


@router.get("/activity-chart")
def activity_chart():
    return get_activity_chart()


@router.get("/recent-activities")
def recent_activities():
    return get_recent_activities()


@router.get("/system-health")
def system_health():
    return get_system_health()


@router.get("/dashboard")
def dashboard():
    contracts = get_all_contracts()

    return {
        "totalUsers": 142,
        "totalContracts": len(contracts),
        "pendingApprovals": len([c for c in contracts if c.get("status") == "Pending"]),
        "complianceScore": 84,
        "activeContracts": len([c for c in contracts if c.get("status") == "Active"]),
        "expiredContracts": len([c for c in contracts if c.get("status") == "Expired"]),
        "highRisk": 8,
        "storageUsed": 73,
    }