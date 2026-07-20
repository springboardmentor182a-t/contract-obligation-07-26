from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, ConfigDict
from typing import List
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
async def list_faqs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(FAQ).order_by(FAQ.sort_order.asc()))
    items = result.scalars().all()
    return [
        FaqResponse(
            q=item.question,
            a=item.answer
        )
        for item in items
    ]

@router.post("/support/tickets", status_code=status.HTTP_201_CREATED)
async def create_ticket(payload: TicketCreate, db: AsyncSession = Depends(get_db)):
    ticket = SupportTicket(
        user_id=1,  # default logged in user
        subject=payload.subject,
        severity=payload.severity,
        description=payload.description,
        status="Open"
    )
    db.add(ticket)
    await db.commit()
    await db.refresh(ticket)
    return {"id": ticket.id, "status": "created"}
