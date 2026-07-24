from fastapi import APIRouter
from src.contracts.service import (
    get_all_contracts,
    create_contract,
    get_compliance_dashboard,
    get_ai_recommendations,
    get_activity_chart,
    get_recent_activities,
    get_system_health,
)
from src.contracts.models import ContractCreate

router = APIRouter()


@router.get("/")
def get_contracts():
    return get_all_contracts()


@router.post("/", status_code=201)
def add_contract(data: ContractCreate):
    return create_contract(data)


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