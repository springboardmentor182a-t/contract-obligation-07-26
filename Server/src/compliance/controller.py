from fastapi import APIRouter, Depends, HTTPException, Query, status, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import csv
from io import StringIO

from . import service
from .models import (
    ComplianceRecordCreate,
    ComplianceRecordUpdate,
    ComplianceRecordResponse,
    DashboardSummaryResponse,
    TrendItemResponse,
    RiskDistributionResponse,
    PaginatedComplianceResponse
)
from database.core import get_db

def verify_compliance_access(x_user_role: str = Header(None)):
    """
    Dependency to verify if the user's role has permission to access the Compliance dashboard.
    Authorized roles: Legal Manager, Compliance Officer.
    """
    if x_user_role not in ["Legal Manager", "Compliance Officer"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: Your role does not have permission to access the Compliance module."
        )


router = APIRouter(
    prefix="/compliance",
    tags=["Compliance Dashboard REST API"],
    dependencies=[Depends(verify_compliance_access)]
)

@router.get("/export")
def export_compliance_records(db: Session = Depends(get_db)):
    """
    Export all compliance records as a CSV file.
    """
    records = service.get_all_compliance_records(db)
    
    f = StringIO()
    writer = csv.writer(f)
    # Write CSV Header
    writer.writerow(["ID", "Requirement", "Category", "Entity", "Contract ID", "Status", "Risk", "Last Audit", "Score"])
    
    for r in records:
        writer.writerow([
            f"CMP-{r.compliance_id:03d}",
            r.requirement,
            r.category,
            r.entity,
            r.contract_id,
            r.status,
            r.risk_level,
            r.last_audit.date().isoformat() if r.last_audit else "",
            r.health_score if r.health_score is not None else 0
        ])
        
    f.seek(0)
    response = StreamingResponse(iter([f.getvalue()]), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=compliance_report.csv"
    return response

# ==========================================
# DASHBOARD WIDGET ENDPOINTS
# ==========================================

@router.get("/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    """
    Get Compliance Dashboard top analytics KPI card summary.
    """
    return service.get_dashboard_summary(db)

@router.get("/trend", response_model=List[TrendItemResponse])
def get_compliance_trend(db: Session = Depends(get_db)):
    """
    Get historical monthly compliance score trend (Jan to Jun line chart).
    """
    return service.get_compliance_trend(db)

@router.get("/risk-distribution", response_model=RiskDistributionResponse)
def get_risk_distribution(db: Session = Depends(get_db)):
    """
    Get risk classification counts for the risk distribution doughnut chart (High, Medium, Low).
    """
    return service.get_risk_distribution(db)

@router.get("/contracts", response_model=PaginatedComplianceResponse)
def get_per_contract_compliance(
    skip: int = Query(0, ge=0),
    limit: int = Query(25, ge=1, le=100),
    status: Optional[str] = Query(None, description="Filter by status (Compliant, Non-Compliant, Warning, Under Review)"),
    risk: Optional[str] = Query(None, description="Filter by risk level (High, Medium, Low)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search compliance requirements or legal entities"),
    db: Session = Depends(get_db)
):
    """
    Get filtered and paginated compliance records for the main dashboard grid/table view.
    """
    return service.get_per_contract_compliance(
        db=db,
        skip=skip,
        limit=limit,
        status=status,
        risk=risk,
        category=category,
        search_query=search
    )


# ==========================================
# CRUD RECORD ENDPOINTS
# ==========================================

@router.get("/records", response_model=List[ComplianceRecordResponse])
def read_all_compliance_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """
    Retrieve all compliance records (GET all records).
    """
    records = service.get_all_compliance_records(db, skip=skip, limit=limit)
    return [r.to_dict() for r in records]

@router.get("/records/{record_id}", response_model=ComplianceRecordResponse)
def read_compliance_record_by_id(record_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a single compliance record details by ID (GET by ID).
    """
    db_record = service.get_compliance_record_by_id(db, record_id)
    if not db_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compliance record with ID {record_id} not found"
        )
    return db_record.to_dict()

@router.post("/records", response_model=ComplianceRecordResponse, status_code=status.HTTP_201_CREATED)
def create_compliance_record(record: ComplianceRecordCreate, db: Session = Depends(get_db)):
    db_record = service.create_compliance_record(db, record.model_dump())
    return db_record.to_dict()

@router.put("/records/{record_id}", response_model=ComplianceRecordResponse)
def update_compliance_record(
    record_id: int,
    record: ComplianceRecordUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing compliance record (PUT update).
    """
    db_record = service.update_compliance_record(db, record_id, record.model_dump(exclude_unset=True))
    if not db_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compliance record with ID {record_id} not found"
        )
    return db_record.to_dict()

@router.delete("/records/{record_id}", status_code=status.HTTP_200_OK)
def delete_compliance_record(record_id: int, db: Session = Depends(get_db)):
    """
    Delete a compliance record (DELETE).
    """
    success = service.delete_compliance_record(db, record_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Compliance record with ID {record_id} not found"
        )
    return {"message": f"Compliance record {record_id} deleted successfully"}