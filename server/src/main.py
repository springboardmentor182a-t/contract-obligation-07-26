from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import Contract, Activity, Deadline, ComplianceItem
from pydantic import BaseModel
from datetime import date, datetime, timedelta 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ContractCreate(BaseModel):
    name: str
    party: str
    status: str
    start_date: date
    end_date: date
    value: float

@app.post("/api/v1/contracts")
def create_contract(contract: ContractCreate, db: Session = Depends(get_db)):
    db_contract = Contract(
        name=contract.name,
        party=contract.party,
        status=contract.status,
        start_date=contract.start_date,
        end_date=contract.end_date,
        value=contract.value
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

@app.get("/api/v1/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    activities = db.query(Activity).all()
    deadlines = db.query(Deadline).all()
    
    active_count = sum(1 for c in contracts if c.status == "Active")
    expiring_count = sum(1 for c in contracts if c.status == "Expiring Soon")
    
    return {
        "kpi": {
            "total": len(contracts),
            "active": active_count,
            "expiring": expiring_count,
            "overdue": 0
        },
        "chartData": [
            {"name": "Active", "value": active_count, "color": "#0088FE"},
            {"name": "Expiring Soon", "value": expiring_count, "color": "#FF8042"}
        ],
        "deadlines": [{"title": d.title, "date": d.date} for d in deadlines],
        "contracts": [{
            "id": c.id,  # --- NEW: Added the ID so React knows which contract to delete ---
            "name": c.name,
            "party": c.party,
            "status": c.status,
            "startDate": c.start_date.strftime("%Y-%m-%d"),
            "endDate": c.end_date.strftime("%Y-%m-%d"),
            "value": f"${c.value:,.2f}"
        } for c in contracts],
        "activities": [{"description": a.description, "time": a.time} for a in activities]
    }

class ComplianceCreate(BaseModel):
    item_name: str
    description: str
    contract_ref: str
    obligation: str
    status: str
    risk_level: str
    next_review: date
    owner_name: str

@app.post("/api/v1/compliance")
def create_compliance_item(item: ComplianceCreate, db: Session = Depends(get_db)):
    db_item = ComplianceItem(
        item_name=item.item_name,
        description=item.description,
        contract_ref=item.contract_ref,
        obligation=item.obligation,
        status=item.status,
        risk_level=item.risk_level,
        next_review=item.next_review,
        owner_name=item.owner_name
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/api/v1/compliance")
def get_compliance_data(db: Session = Depends(get_db)):
    items = db.query(ComplianceItem).all()
    
    total_items = len(items)
    compliant_count = sum(1 for i in items if i.status == "Compliant")
    at_risk_count = sum(1 for i in items if i.status == "At Risk")
    non_compliant_count = sum(1 for i in items if i.status == "Non-Compliant")
    pending_count = sum(1 for i in items if i.status == "Pending Review")
    
    overall_score = round((compliant_count / total_items * 100)) if total_items > 0 else 0
    
    upcoming_reviews = sorted(
        [i for i in items if i.next_review and i.status != "Compliant"], 
        key=lambda x: x.next_review
    )[:5]

    return {
        "kpi": {
            "score": overall_score,
            "compliant": compliant_count,
            "atRisk": at_risk_count,
            "nonCompliant": non_compliant_count,
            "pending": pending_count
        },
        "issueBreakdown": [
            {"name": "Compliant", "value": compliant_count, "color": "#2ecc71"},
            {"name": "At Risk", "value": at_risk_count, "color": "#f39c12"},
            {"name": "Non-Compliant", "value": non_compliant_count, "color": "#e74c3c"},
            {"name": "Pending Review", "value": pending_count, "color": "#9b59b6"}
        ],
        "upcomingReviews": [{
            "itemName": r.item_name,
            "contractRef": r.contract_ref,
            "date": r.next_review.strftime("%d %b %Y"),
            "daysLeft": (r.next_review - datetime.now().date()).days
        } for r in upcoming_reviews],
        "items": [{
            "id": i.id,
            "itemName": i.item_name,
            "description": i.description,
            "contractRef": i.contract_ref,
            "obligation": i.obligation,
            "status": i.status,
            "riskLevel": i.risk_level,
            "lastReview": i.last_review.strftime("%d %b %Y") if i.last_review else "-",
            "nextReview": i.next_review.strftime("%d %b %Y") if i.next_review else "-",
            "owner": i.owner_name
        } for i in items]
    }

@app.delete("/api/v1/compliance/{item_id}")
def delete_compliance_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ComplianceItem).filter(ComplianceItem.id == item_id).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Compliance item deleted successfully"}

# --- NEW: DELETE endpoint for Contracts ---
@app.delete("/api/v1/contracts/{contract_id}")
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    
    if not contract:
        raise HTTPException(status_code=404, detail="Contract not found")
    
    db.delete(contract)
    db.commit()
    return {"message": "Contract deleted successfully"}
