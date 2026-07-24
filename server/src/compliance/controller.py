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


def _format_iso(dt: datetime | None) -> str:
    if dt is None:
        return datetime.now(timezone.utc).isoformat()
    return dt.isoformat()


@router.get("/controls", response_model=List[ComplianceControlResponse])
def get_compliance_controls(db: Session = Depends(get_db)):
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
