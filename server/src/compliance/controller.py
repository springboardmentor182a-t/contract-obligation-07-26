from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List

from src.database.core import get_db
from src.database.models import ComplianceControl, ComplianceLog
from .schemas import (
    ComplianceControlResponse,
    ComplianceLogResponse,
    ComplianceControlCreate,
    ComplianceLogCreate,
    ComplianceSummaryResponse,
)

router = APIRouter(prefix="/compliance", tags=["Compliance"])

INITIAL_CONTROLS = [
    {
        "id": "ISO-27001-A.9.1.1",
        "title": "Access Control Policy & Multi-Factor Enforcement",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Access control matrix verified against active directory groups."},
            {"status": "VERIFIED", "message": "Quarterly privilege user review completed with zero unauthorized accounts."}
        ]
    },
    {
        "id": "SOC2-CC-6.1",
        "title": "Logical Access & Role-Based Authorization",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Role RBAC policies re-validated for contract management APIs."}
        ]
    },
    {
        "id": "HIPAA-164.312(a)",
        "title": "Access Control & Data Encryption at Rest",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "AES-256 encryption keys rotated for storage volume."}
        ]
    },
    {
        "id": "GDPR-ART-32",
        "title": "Security of Processing & Data Protection",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "DPIA conducted and verified for cloud infrastructure."}
        ]
    },
    {
        "id": "PCI-DSS-v4-3.2",
        "title": "Sensitive Authentication Data Protection",
        "status": "WARNING",
        "weight": 75,
        "logs": [
            {"status": "WARNING", "message": "1 storage bucket missing automated key rotation rule."}
        ]
    },
    {
        "id": "NIST-800-53-AC-2",
        "title": "Account Management & Role Enforcement",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Inactive user auto-disable policy enforced."}
        ]
    },
    {
        "id": "ISO-27001-A.12.6.1",
        "title": "Vulnerability Management Protocol",
        "status": "WARNING",
        "weight": 50,
        "logs": [
            {"status": "WARNING", "message": "2 low-priority npm package patches pending installation."}
        ]
    },
    {
        "id": "SOC2-CC-7.2",
        "title": "Incident Monitoring & Anomaly Detection",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "SIEM audit alert channels verified."}
        ]
    },
    {
        "id": "SOX-404-ITGC",
        "title": "IT General Controls & Change Log Audit",
        "status": "FAILED",
        "weight": 60,
        "logs": [
            {"status": "FAILED", "message": "Unapproved schema migration detected without secondary signature."}
        ]
    },
    {
        "id": "CCPA-1798.100",
        "title": "Consumer Privacy Notice & Disclosure",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Privacy policy agreement links verified on public landing."}
        ]
    },
    {
        "id": "ISO-27001-A.8.1.1",
        "title": "Asset Inventory & Responsibility Assignment",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Server hardware asset tag list synchronized with cloud CMDB."}
        ]
    },
    {
        "id": "SOC2-CC-6.8",
        "title": "Unauthorized & Malicious Code Prevention",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Endpoint protection updated across all developer workstations."}
        ]
    },
    {
        "id": "NIST-800-53-SI-4",
        "title": "System Monitoring & Intrusion Detection",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Intrusion detection signatures updated to latest CVE definition."}
        ]
    },
    {
        "id": "HIPAA-164.312(e)",
        "title": "Transmission Security & TLS 1.3 Enforcement",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "All API endpoints configured to mandate TLS 1.3."}
        ]
    },
    {
        "id": "GDPR-ART-33",
        "title": "Personal Data Breach Notification Workflow",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Incident response notification SLA tested and confirmed."}
        ]
    },
    {
        "id": "ISO-27001-A.15.1.1",
        "title": "Supplier Relationship Information Security",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Vendor security questionnaires updated for Q3 vendors."}
        ]
    },
    {
        "id": "SOC2-CC-9.2",
        "title": "Vendor Risk Assessment & Contract SLA",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Third-party SaaS contract SLAs reviewed for compliance."}
        ]
    },
    {
        "id": "NIST-800-53-CP-9",
        "title": "Information System Backup & Recovery Testing",
        "status": "PASSED",
        "weight": 100,
        "logs": [
            {"status": "VERIFIED", "message": "Disaster recovery snapshot restore simulation succeeded in 12 mins."}
        ]
    }
]


def _ensure_seeded(db: Session):
    existing = db.execute(select(ComplianceControl)).scalars().first()
    if existing:
        return

    now = datetime.now(timezone.utc)
    for item in INITIAL_CONTROLS:
        ctrl = ComplianceControl(
            id=item["id"],
            title=item["title"],
            status=item["status"],
            weight=item["weight"],
            last_verified=now,
        )
        db.add(ctrl)
        db.flush()

        for log in item.get("logs", []):
            clog = ComplianceLog(
                control_id=ctrl.id,
                timestamp=now,
                status=log["status"],
                message=log["message"],
            )
            db.add(clog)

    db.commit()


def _format_iso(dt: datetime | None) -> str:
    if dt is None:
        return datetime.now(timezone.utc).isoformat()
    return dt.isoformat()


@router.get("/controls", response_model=List[ComplianceControlResponse])
def get_compliance_controls(db: Session = Depends(get_db)):
    _ensure_seeded(db)
    controls = db.execute(select(ComplianceControl)).scalars().all()
    
    res = []
    for ctrl in controls:
        log_responses = [
            ComplianceLogResponse(
                id=log.id,
                timestamp=_format_iso(log.timestamp),
                status=log.status,
                message=log.message,
            )
            for log in ctrl.logs
        ]
        res.append(
            ComplianceControlResponse(
                id=ctrl.id,
                title=ctrl.title,
                status=ctrl.status,
                weight=ctrl.weight,
                lastVerified=_format_iso(ctrl.last_verified),
                logs=log_responses,
            )
        )
    return res


@router.get("/controls/{control_id}", response_model=ComplianceControlResponse)
def get_compliance_control(control_id: str, db: Session = Depends(get_db)):
    _ensure_seeded(db)
    ctrl = db.execute(select(ComplianceControl).where(ComplianceControl.id == control_id)).scalars().first()
    if not ctrl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Control not found")
    
    log_responses = [
        ComplianceLogResponse(
            id=log.id,
            timestamp=_format_iso(log.timestamp),
            status=log.status,
            message=log.message,
        )
        for log in ctrl.logs
    ]
    return ComplianceControlResponse(
        id=ctrl.id,
        title=ctrl.title,
        status=ctrl.status,
        weight=ctrl.weight,
        lastVerified=_format_iso(ctrl.last_verified),
        logs=log_responses,
    )


@router.post("/controls", response_model=ComplianceControlResponse, status_code=status.HTTP_201_CREATED)
def create_compliance_control(payload: ComplianceControlCreate, db: Session = Depends(get_db)):
    existing = db.execute(select(ComplianceControl).where(ComplianceControl.id == payload.id)).scalars().first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Control ID already exists")
    
    now = datetime.now(timezone.utc)
    ctrl = ComplianceControl(
        id=payload.id,
        title=payload.title,
        status=payload.status,
        weight=payload.weight,
        last_verified=now,
    )
    db.add(ctrl)
    db.commit()
    db.refresh(ctrl)
    return ComplianceControlResponse(
        id=ctrl.id,
        title=ctrl.title,
        status=ctrl.status,
        weight=ctrl.weight,
        lastVerified=_format_iso(ctrl.last_verified),
        logs=[],
    )


@router.post("/controls/{control_id}/logs", response_model=ComplianceLogResponse, status_code=status.HTTP_201_CREATED)
def add_compliance_log(control_id: str, payload: ComplianceLogCreate, db: Session = Depends(get_db)):
    ctrl = db.execute(select(ComplianceControl).where(ComplianceControl.id == control_id)).scalars().first()
    if not ctrl:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Control not found")
    
    now = datetime.now(timezone.utc)
    log = ComplianceLog(
        control_id=ctrl.id,
        timestamp=now,
        status=payload.status,
        message=payload.message,
    )
    ctrl.last_verified = now
    db.add(log)
    db.commit()
    db.refresh(log)
    return ComplianceLogResponse(
        id=log.id,
        timestamp=_format_iso(log.timestamp),
        status=log.status,
        message=log.message,
    )


@router.get("/summary", response_model=ComplianceSummaryResponse)
def get_compliance_summary(db: Session = Depends(get_db)):
    _ensure_seeded(db)
    controls = db.execute(select(ComplianceControl)).scalars().all()
    
    total = len(controls)
    if total == 0:
        return ComplianceSummaryResponse(
            overallScore=100,
            passedChecks=0,
            warningsOutstanding=0,
            failedPolicies=0,
            totalControls=0,
        )
    
    passed = sum(1 for c in controls if c.status == "PASSED")
    warnings = sum(1 for c in controls if c.status == "WARNING")
    failed = sum(1 for c in controls if c.status == "FAILED")
    
    total_weight = sum(c.weight for c in controls)
    overall = round(total_weight / total) if total > 0 else 100
    
    return ComplianceSummaryResponse(
        overallScore=overall,
        passedChecks=passed,
        warningsOutstanding=warnings,
        failedPolicies=failed,
        totalControls=total,
    )
