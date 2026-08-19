from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select

from src.auth.dependencies import ALL_ROLES, require_roles
from src.database.core import get_db
from src.database.models import User, Subscription, PaymentMethod, Invoice
from src.billing.schemas import BillingDetailsResponse, SubscriptionSchema, PaymentMethodSchema, InvoiceSchema

router = APIRouter(prefix="/billing", tags=["Billing"])

@router.get(
    "",
    response_model=BillingDetailsResponse,
    dependencies=[Depends(require_roles(*ALL_ROLES))],
)
def get_billing_details(db: Session = Depends(get_db)):
    # For now, just use the first user in the DB as the context owner
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=404, detail="No users found to fetch billing details.")

    # Fetch or create subscription
    sub = db.query(Subscription).filter_by(user_id=user.id).first()
    if not sub:
        sub = Subscription(user_id=user.id)
        db.add(sub)
    
    # Fetch or create payment method
    pm = db.query(PaymentMethod).filter_by(user_id=user.id).first()
    if not pm:
        pm = PaymentMethod(user_id=user.id)
        db.add(pm)

    # Fetch invoices
    invoices = db.query(Invoice).filter_by(user_id=user.id).all()
    
    db.commit()
    db.refresh(sub)
    db.refresh(pm)

    return BillingDetailsResponse(
        subscription=SubscriptionSchema.from_orm(sub),
        payment_method=PaymentMethodSchema.from_orm(pm),
        invoices=[InvoiceSchema.from_orm(inv) for inv in invoices]
    )

@router.put(
    "/subscription/upgrade",
    dependencies=[Depends(require_roles(*ALL_ROLES))],
)
def upgrade_subscription(db: Session = Depends(get_db)):
    user = db.query(User).first()
    sub = db.query(Subscription).filter_by(user_id=user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    sub.plan_name = "Enterprise Ultra"
    sub.plan_desc = "Unlimited everything • 24/7 Support"
    sub.price = "$9,600"
    sub.status = "Active"
    sub.seats_total = 500
    sub.storage_total = 1000
    db.commit()
    return {"message": "Plan upgraded successfully"}

@router.put(
    "/subscription/cancel",
    dependencies=[Depends(require_roles(*ALL_ROLES))],
)
def cancel_subscription(db: Session = Depends(get_db)):
    user = db.query(User).first()
    sub = db.query(Subscription).filter_by(user_id=user.id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subscription not found")

    sub.status = "Canceled"
    db.commit()
    return {"message": "Plan canceled successfully"}

@router.put(
    "/payment-method",
    dependencies=[Depends(require_roles(*ALL_ROLES))],
)
def update_payment_method(db: Session = Depends(get_db)):
    import random
    user = db.query(User).first()
    pm = db.query(PaymentMethod).filter_by(user_id=user.id).first()
    if not pm:
        raise HTTPException(status_code=404, detail="Payment method not found")

    # Simulate random new card
    card_types = ["VISA", "Mastercard", "Amex"]
    pm.card_type = random.choice(card_types)
    pm.last_four = str(random.randint(1000, 9999))
    pm.expiry_date = f"{random.randint(1, 12):02d}/{random.randint(2026, 2035)}"
    db.commit()
    return {"message": "Payment method updated"}

@router.get(
    "/invoices/{invoice_id}/download",
    dependencies=[Depends(require_roles(*ALL_ROLES))],
)
def download_invoice(invoice_id: str):
    # Return a simulated PDF file content
    pdf_content = b"%PDF-1.4\n%This is a simulated PDF for invoice " + invoice_id.encode() + b"\n%%EOF"
    return Response(content=pdf_content, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename="invoice_{invoice_id}.pdf"'})
