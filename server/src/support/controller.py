from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from jose import JWTError, jwt as jose_jwt
from fastapi.security import OAuth2PasswordBearer

from src.auth.jwt import SECRET_KEY, ALGORITHM
from src.audit.service import create_audit_log
from src.database.core import get_db
from src.database.models import FAQ, SupportTicket

router = APIRouter(prefix="", tags=["Support & FAQ"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def _get_user_id(token: Optional[str]) -> int:
    if token:
        try:
            payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            uid = int(payload.get("sub", 0))
            if uid:
                return uid
        except (JWTError, ValueError):
            pass
    return 1


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
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
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

