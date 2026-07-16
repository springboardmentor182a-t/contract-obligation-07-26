from pydantic import BaseModel


class Contract(BaseModel):
    id: str
    company: str
    contract: str
    category: str
    value: str
    owner: str
    status: str
    compliance: int
    renewal: str

    start_date: str
    end_date: str
    days_remaining: int
    priority: str
    description: str

    paid_amount: str
    outstanding: str
    currency: str
    payment_progress: int

    renewal_type: str
    notice_period: str
    auto_renewal: str

    created_on: str
    effective_date: str
    expiry_date: str
    renewal_reminder: str

    documents: int
    obligations: int
    tasks: int