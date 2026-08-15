from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from src.auth.dependencies import ALL_ROLES, require_roles
from src.audit.service import create_audit_log
from src.database.core import get_db
from src.database.models import FAQ, SupportTicket, User

router = APIRouter(prefix="", tags=["Support & FAQ"])


class FaqResponse(BaseModel):
    q: str
    a: str

    model_config = ConfigDict(from_attributes=True)


class TicketCreate(BaseModel):
    subject: str
    severity: str
    description: str


@router.get("/faqs", response_model=List[FaqResponse])
def list_faqs(db: Session = Depends(get_db)):
    items = db.execute(select(FAQ).order_by(FAQ.sort_order.asc())).scalars().all()
    return [
        FaqResponse(
            q=item.question,
            a=item.answer
        )
        for item in items
    ]


@router.post("/support/tickets", status_code=status.HTTP_201_CREATED)
def create_ticket(
    payload: TicketCreate,
    current_user: User = Depends(require_roles(*ALL_ROLES)),
    db: Session = Depends(get_db),
):
    user_id = current_user.id
    ticket = SupportTicket(
        user_id=user_id,
        subject=payload.subject,
        severity=payload.severity,
        description=payload.description,
        status="Open"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="CREATE",
        action="Support Ticket Created",
        module="Support",
        description=(
            f"Created support ticket: {ticket.subject} "
            f"(ID: {ticket.id}, severity: {ticket.severity}, "
            f"status: {ticket.status})"
        ),
    )

    return {"id": ticket.id, "status": "created"}
