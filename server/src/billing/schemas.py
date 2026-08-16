from pydantic import BaseModel
from typing import List

class SubscriptionSchema(BaseModel):
    plan_name: str
    plan_desc: str
    price: str
    status: str
    seats_used: int
    seats_total: int
    storage_used: int
    storage_total: int

    class Config:
        from_attributes = True

class PaymentMethodSchema(BaseModel):
    card_type: str
    last_four: str
    expiry_date: str

    class Config:
        from_attributes = True

class InvoiceSchema(BaseModel):
    id: int
    invoice_id: str
    date: str
    amount: str
    status: str

    class Config:
        from_attributes = True

class BillingDetailsResponse(BaseModel):
    subscription: SubscriptionSchema
    payment_method: PaymentMethodSchema
    invoices: List[InvoiceSchema]
