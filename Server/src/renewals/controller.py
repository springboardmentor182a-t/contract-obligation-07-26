from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database.core import get_db
from renewals.models import (
    StatusUpdateRequest,
    ApprovalActionRequest,
    ReminderCreateRequest,
)
from renewals.service import (
    get_dashboard_summary,
    get_renewals,
    get_renewal_detail,
    update_renewal_status,
    submit_approval,
    schedule_reminder,
    send_reminder_action,
    seed_renewals,
)

router = APIRouter(
    prefix="/renewals",
    tags=["renewals"],
)


@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    """Get renewal dashboard summary counts."""
    return get_dashboard_summary(db)


@router.get("/")
def list_renewals(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all renewals with optional filters."""
    return get_renewals(db, search=search, category=category, status=status)


@router.get("/{renewal_id}")
def renewal_detail(renewal_id: int, db: Session = Depends(get_db)):
    """Get full renewal detail including approvals and history."""
    detail = get_renewal_detail(db, renewal_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return detail


@router.put("/{renewal_id}/status")
def change_status(
    renewal_id: int,
    request: StatusUpdateRequest,
    db: Session = Depends(get_db),
):
    """Update renewal status."""
    valid_statuses = ["Upcoming", "In Progress", "Renewed", "Expired", "Cancelled"]
    if request.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {valid_statuses}",
        )

    result = update_renewal_status(db, renewal_id, request.status, request.performed_by)
    if not result:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return {"message": f"Status updated to {request.status}"}


@router.post("/{renewal_id}/approve")
def approval_action(
    renewal_id: int,
    request: ApprovalActionRequest,
    db: Session = Depends(get_db),
):
    """Submit an approval or rejection action."""
    if request.action not in ["Approved", "Rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Action must be 'Approved' or 'Rejected'",
        )

    result = submit_approval(
        db,
        renewal_id,
        request.step_name,
        request.action,
        request.approver,
        request.comments,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return {"message": f"Step '{request.step_name}' marked as {request.action}"}


@router.post("/{renewal_id}/reminder")
def create_reminder(
    renewal_id: int,
    request: ReminderCreateRequest,
    db: Session = Depends(get_db),
):
    """Schedule a reminder for a renewal."""
    result = schedule_reminder(db, renewal_id, request.reminder_date, request.message)
    if not result:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return {"message": "Reminder scheduled", "reminder_id": result.reminder_id}


@router.post("/{renewal_id}/send-reminder")
def send_reminder(renewal_id: int, db: Session = Depends(get_db)):
    """Send pending reminders for a renewal."""
    result = send_reminder_action(db, renewal_id)
    if not result:
        raise HTTPException(
            status_code=404, detail="No pending reminders found for this renewal"
        )
    return result


@router.post("/seed")
def seed_data(db: Session = Depends(get_db)):
    """Seed the database with sample renewal data."""
    return seed_renewals(db)
