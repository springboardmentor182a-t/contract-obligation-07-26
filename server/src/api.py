from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.auth.controller import router as auth_router
from src.contracts.controller import router as contracts_router
from src.dashboard.controller import router as dashboard_router
from src.obligation.controller import router as obligation_router
from src.notifications.controller import router as notifications_router
from src.ai.controller import router as ai_router
from src.database.db import get_db
from src.database.models import User, Contract, Obligation, Renewal, Transaction, AuditLog, TaxEstimator, Notification
from pydantic import BaseModel
import uuid
from datetime import datetime

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(contracts_router, prefix="/contracts", tags=["contracts"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(obligation_router, prefix="/obligations", tags=["obligations"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["notifications"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])

@api_router.post("/demo/load")
def load_demo_data(db: Session = Depends(get_db)):
    from datetime import date, timedelta
    import uuid
    # Delete existing demo rows
    db.query(Renewal).delete()
    db.query(Obligation).delete()
    db.query(Contract).delete()
    
    # 6 Realistic mock contracts
    base_date = date.today()
    contracts = [
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Acme Corp", type="MSA", status="Active", value=150000.00, owner="Alice Smith", date=base_date - timedelta(days=30)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Globex Inc", type="NDA", status="Active", value=0.00, owner="Bob Jones", date=base_date - timedelta(days=15)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Initech", type="SOW", status="Draft", value=75000.00, owner="Charlie Brown", date=base_date - timedelta(days=5)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Soylent Corp", type="Vendor Agreement", status="Pending Signature", value=45000.00, owner="Diana Prince", date=base_date - timedelta(days=2)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Umbrella Corp", type="MSA", status="Expired", value=200000.00, owner="Evan Wright", date=base_date - timedelta(days=400)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Wayne Enterprises", type="Partnership", status="Active", value=500000.00, owner="Fiona Clark", date=base_date - timedelta(days=100)),
    ]
    db.add_all(contracts)
    db.commit()
    
    # Add obligations
    obligations = [
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Quarterly True-up Report", dueDate=base_date + timedelta(days=15), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Annual Security Audit", dueDate=base_date + timedelta(days=90), status="Pending", priority="Medium"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[2].id, description="Deliverable 1 Approval", dueDate=base_date + timedelta(days=5), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[3].id, description="First Payment Milestone", dueDate=base_date + timedelta(days=30), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[5].id, description="Joint Marketing Plan", dueDate=base_date + timedelta(days=45), status="Pending", priority="Low"),
    ]
    db.add_all(obligations)
    db.commit()
    
    return {"message": "Demo data loaded successfully"}

@api_router.get("/reports/mockData")
def get_reports(db: Session = Depends(get_db)):
    from collections import defaultdict
    contracts = db.query(Contract).all()
    monthly_totals = defaultdict(float)
    
    for c in contracts:
        if c.date:
            month_name = c.date.strftime("%b")
            monthly_totals[month_name] += c.value or 0
    
    # Ensure at least some months have data if db is empty or just return the existing data
    if not monthly_totals:
        return [
            { "name": "Jan", "value": 0 },
            { "name": "Feb", "value": 0 },
            { "name": "Mar", "value": 0 },
            { "name": "Apr", "value": 0 },
            { "name": "May", "value": 0 },
            { "name": "Jun", "value": 0 }
        ]
        
    result = [{"name": m, "value": v} for m, v in monthly_totals.items()]
    # Optional: sort by month, but dictionary order or keeping it as is might be fine
    return result

@api_router.get("/reports/details")
def get_report_details(db: Session = Depends(get_db)):
    total_val = sum([c.value or 0 for c in db.query(Contract).all()])
    renewals_count = db.query(Renewal).count()
    contracts = db.query(Contract).all()
    
    csv_header = "id,name,value\n"
    csv_rows = [f"{c.id},{c.vendor},{c.value or 0}" for c in contracts]
    csv_data = csv_header + "\n".join(csv_rows)
    
    return {
        "totalValue": f"${total_val:,.2f}",
        "renewals": str(renewals_count),
        "compliance": "98.5%",
        "csvData": csv_data
    }

@api_router.get("/audit-logs")
def get_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).all()

@api_router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    active_count = db.query(Contract).filter(Contract.status == "Active").count()
    renewals_count = db.query(Renewal).count()
    pending_obl = db.query(Obligation).filter(Obligation.status == "Pending").count()
    high_risk_count = db.query(Contract).filter(Contract.risk.in_(["High", "Critical"])).count()
    expired_count = db.query(Contract).filter(Contract.status == "Expired").count()
    total_obl = db.query(Obligation).count()
    overdue_obl = db.query(Obligation).filter(Obligation.status == "Overdue").count()
    compliance_rate = round(100 - (overdue_obl / total_obl * 100), 1) if total_obl else 100.0

    return {
        "activeContracts": { "metric": str(active_count), "trendText": "+12% this month", "trendDirection": "up" },
        "upcomingRenewals": { "metric": str(renewals_count), "trendText": "+4 this week", "trendDirection": "up" },
        "pendingObligations": { "metric": str(pending_obl), "trendText": "-2% from last week", "trendDirection": "down" },
        "complianceRate": { "metric": f"{compliance_rate}%", "trendText": "+2.4% vs target", "trendDirection": "up" },
        "highRisk": { "metric": str(high_risk_count), "trendText": "-2 this week", "trendDirection": "down" },
        "expired": { "metric": str(expired_count), "trendText": "+1 this month", "trendDirection": "up" },
    }

@api_router.get("/dashboard/activity")
def get_dashboard_activity(db: Session = Depends(get_db)):
    from datetime import date, timedelta
    
    # Generate last 6 months using pure datetime
    today = date.today()
    months = []
    
    # Basic logic to go back month by month
    curr_date = today
    for _ in range(6):
        months.insert(0, curr_date.strftime("%b"))
        # go to first of month
        first = curr_date.replace(day=1)
        # go back one day to previous month
        curr_date = first - timedelta(days=1)
        
    activity_map = {m: {"month": m, "drafts": 0, "executed": 0} for m in months}
    
    contracts = db.query(Contract).all()
    for c in contracts:
        if not c.date:
            continue
        m_str = c.date.strftime("%b")
        if m_str in activity_map:
            # Simple heuristic based on mock statuses
            if c.status.lower() in ["draft", "pending", "pending signature"]:
                activity_map[m_str]["drafts"] += 1
            else:
                activity_map[m_str]["executed"] += 1
                
    return list(activity_map.values())

@api_router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    trxs = db.query(Transaction).all()
    return [
        {
            "id": t.transaction_id,
            "date": t.date,
            "description": t.description,
            "amount": t.amount,
            "status": t.status
        } for t in trxs
    ]

@api_router.get("/renewals")
def get_renewals(db: Session = Depends(get_db)):
    from src.database.models import Contract
    renewals = db.query(Renewal, Contract).join(Contract, Renewal.contract_id == Contract.id).all()
    return [
        {
            "id": r.id,
            "contract": c.vendor,
            "type": c.type,
            "renewalDate": r.renewal_date.strftime("%b %d, %Y") if r.renewal_date else "",
            "status": r.status,
            "owner": c.owner
        } for r, c in renewals
    ]

@api_router.get("/tax-estimators")
def get_tax_estimators(db: Session = Depends(get_db)):
    import json
    te = db.query(TaxEstimator).first()
    if te:
        return {
            "estimatedTax": te.estimatedTax,
            "taxRate": te.taxRate,
            "deductions": te.deductions,
            "netIncome": te.netIncome,
            "breakdown": json.loads(te.breakdown) if te.breakdown else []
        }
    return {
        "estimatedTax": "$0",
        "taxRate": "0%",
        "deductions": "$0",
        "netIncome": "$0",
        "breakdown": []
    }

class UserCreate(BaseModel):
    name: str
    email: str
    role: str

class UserUpdate(BaseModel):
    name: str
    email: str
    role: str
    status: str

@api_router.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@api_router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
        name=user.name,
        email=user.email,
        role=user.role,
        status="Active",
        lastLogin="Never"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@api_router.put("/users/{user_id}")
def update_user(user_id: str, user: UserUpdate, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.user_id == user_id).first()
    if u:
        u.name = user.name
        u.email = user.email
        u.role = user.role
        u.status = user.status
        db.commit()
        db.refresh(u)
        return u
    return {"error": "User not found"}

@api_router.delete("/users/{user_id}")
def delete_user(user_id: str, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.user_id == user_id).first()
    if u:
        u.status = "Inactive"
        db.commit()
        return {"message": "User deactivated"}
    return {"error": "User not found"}

@api_router.get("/compliance/summary")
def get_compliance_summary(db: Session = Depends(get_db)):
    total_obl = db.query(Obligation).count()
    completed_obl = db.query(Obligation).filter(Obligation.status == "Completed").count()
    overdue_obl = db.query(Obligation).filter(Obligation.status == "Overdue").count()
    
    rate = round(((total_obl - overdue_obl) / total_obl * 100), 1) if total_obl > 0 else 96.0
    grade = "A+" if rate >= 98 else "A" if rate >= 95 else "A-" if rate >= 90 else "B+" if rate >= 85 else "B"
    
    depts = ["Legal", "Procurement", "HR", "IT", "Finance"]
    dept_stats = []
    for d in depts:
        contracts_in_dept = db.query(Contract).filter(Contract.department == d).all()
        c_ids = [c.id for c in contracts_in_dept]
        if c_ids:
            dept_obls = db.query(Obligation).filter(Obligation.contract_id.in_(c_ids)).all()
            overdue_count = sum(1 for o in dept_obls if o.status == "Overdue")
            total_d_obl = len(dept_obls)
            dept_score = round(100 - (overdue_count / total_d_obl * 100)) if total_d_obl else 95
        else:
            dept_score = 92
        
        status_label = "Compliant" if dept_score >= 90 else "In Review" if dept_score >= 80 else "Action Required"
        color_class = "bg-emerald-500" if dept_score >= 90 else "bg-amber-500" if dept_score >= 80 else "bg-rose-500"
        
        dept_stats.append({
            "name": f"{d} & Regulatory" if d == "Legal" else f"{d} & Vendor Mgmt" if d == "Procurement" else f"Information Security & {d}" if d == "IT" else d,
            "score": dept_score,
            "status": status_label,
            "color": color_class
        })
        
    audit_count = db.query(AuditLog).count()
    
    return {
        "healthGrade": grade,
        "healthScore": f"{rate}% Average",
        "obligationsMet": completed_obl or 14,
        "obligationsTotal": total_obl or 18,
        "fulfillmentRate": f"{round((completed_obl / total_obl * 100), 1) if total_obl else 94.0}%",
        "activeAudits": min(5, audit_count) if audit_count else 3,
        "departments": dept_stats
    }

