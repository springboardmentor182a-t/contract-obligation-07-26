from fastapi import APIRouter, Depends, status
from sqlalchemy.future import select
from sqlalchemy.orm import Session
from pydantic import BaseModel, ConfigDict
from typing import List
from src.audit.service import create_audit_log
from src.database.core import get_db
from src.database.models import FAQ, SupportTicket

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
    result = db.execute(select(FAQ).order_by(FAQ.sort_order.asc()))
    items = result.scalars().all()
    return [
        FaqResponse(
            q=item.question,
            a=item.answer
        )
        for item in items
    ]

@router.post("/support/tickets", status_code=status.HTTP_201_CREATED)
def create_ticket(payload: TicketCreate, db: Session = Depends(get_db)):
    ticket = SupportTicket(
        user_id=1,  # default logged in user
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
        user_id=None,
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
