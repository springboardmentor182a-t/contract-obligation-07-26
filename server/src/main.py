from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import (
    Contract,
    Activity,
    Deadline,
    ComplianceItem,
    ReportHistory,
)
from src.users.controller import router as users_router
from src.contracts.controller import router as contracts_router
from src.renewals.controller import router as renewals_router
from pydantic import BaseModel
from datetime import date, datetime
from src.database.models import Contract, Activity, Deadline, ComplianceItem, ReportHistory, Document, AppNotification, User
from src.users.controller import router as users_router
from src.contracts.controller import router as contracts_router
from src.calendar.controller import router as calendar_router

from pydantic import BaseModel
from datetime import date, datetime, timedelta 
from typing import Optional 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(contracts_router)

class ContractCreate(BaseModel):
    name: str
    party: str
    status: str
    start_date: date
    end_date: date
    value: float
    department: str = "General" 

@app.post("/api/v1/contracts")
def create_contract(contract: ContractCreate, db: Session = Depends(get_db)):
    db_contract = Contract(
        name=contract.name, party=contract.party, status=contract.status,
        start_date=contract.start_date, end_date=contract.end_date,
        value=contract.value, department=contract.department
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract
app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"],
)

app.include_router(renewals_router)
class ContractCreate(BaseModel):
    name: str
    party: str
    status: str
    start_date: date
    end_date: date
    value: float
    department: str = "General" # --- NEW: Accepts department on creation ---
    prefix="/api/v1",
    tags=["Users"]
)
app.include_router(
    contracts_router,
    prefix="/api/v1",
    tags=["Contracts"]
)
app.include_router(
    calendar_router,
    prefix="/api/v1",
    tags=["Calendar"]
)


@app.get("/api/v1/dashboard")
def get_dashboard_data(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    activities = db.query(Activity).all()
    deadlines = db.query(Deadline).all()
    
    active_count = sum(1 for c in contracts if c.status == "Active")
    expiring_count = sum(1 for c in contracts if c.status == "Expiring Soon")
    
    return {
        "kpi": { "total": len(contracts), "active": active_count, "expiring": expiring_count, "overdue": 0 },
        "chartData": [
            {"name": "Active", "value": active_count, "color": "#0088FE"},
            {"name": "Expiring Soon", "value": expiring_count, "color": "#FF8042"}
        ],
        "deadlines": [{"title": d.title, "date": d.date} for d in deadlines],
        "contracts": [{
            "id": c.id, "name": c.name, "party": c.party, "company": c.party,
            "contract": c.name, "category": "General", "owner": "System",
            "status": c.status, "startDate": c.start_date, "endDate": c.end_date, "value": c.value
            "id": c.id,
            "name": c.contract,
            "party": c.company,

            # Existing keys (for frontend compatibility)
            "name": c.contract,
            "party": c.company,

            # Additional keys
            "company": c.company,
            "contract": c.contract,
            "category": c.category,
            "owner": c.owner,

            "status": c.status,
            "startDate": c.start_date,
            "endDate": c.end_date,
            "value": c.value
>>>>>>> 62bf7858f9a3264555a383f4eaa304140997c303
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
        item_name=item.item_name, description=item.description, contract_ref=item.contract_ref,
        obligation=item.obligation, status=item.status, risk_level=item.risk_level,
        next_review=item.next_review, owner_name=item.owner_name
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
    upcoming_reviews = sorted([i for i in items if i.next_review and i.status != "Compliant"], key=lambda x: x.next_review)[:5]

    return {
        "kpi": { "score": overall_score, "compliant": compliant_count, "atRisk": at_risk_count, "nonCompliant": non_compliant_count, "pending": pending_count },
        "issueBreakdown": [
            {"name": "Compliant", "value": compliant_count, "color": "#2ecc71"},
            {"name": "At Risk", "value": at_risk_count, "color": "#f39c12"},
            {"name": "Non-Compliant", "value": non_compliant_count, "color": "#e74c3c"},
            {"name": "Pending Review", "value": pending_count, "color": "#9b59b6"}
        ],
        "upcomingReviews": [{
            "itemName": r.item_name, "contractRef": r.contract_ref, "date": r.next_review.strftime("%d %b %Y"),
            "daysLeft": (r.next_review - datetime.now().date()).days
        } for r in upcoming_reviews],
        "items": [{
            "id": i.id, "itemName": i.item_name, "description": i.description, "contractRef": i.contract_ref,
            "obligation": i.obligation, "status": i.status, "riskLevel": i.risk_level,
            "lastReview": i.last_review.strftime("%d %b %Y") if i.last_review else "-",
            "nextReview": i.next_review.strftime("%d %b %Y") if i.next_review else "-", "owner": i.owner_name
        } for i in items]
    }

@app.delete("/api/v1/compliance/{item_id}")
def delete_compliance_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(ComplianceItem).filter(ComplianceItem.id == item_id).first()
    if not item: raise HTTPException(status_code=404, detail="Item not found")
    db.delete(item)
    db.commit()
    return {"message": "Compliance item deleted successfully"}


@app.delete("/api/v1/contracts/{contract_id}")
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract: raise HTTPException(status_code=404, detail="Contract not found")
    db.delete(contract)
    db.commit()
    return {"message": "Contract deleted successfully"}



class ReportCreate(BaseModel):
    name: str
    type: str
    generatedBy: str
    date: str
    format: str
    status: str

@app.post("/api/v1/reports/history")
def add_report_history(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = ReportHistory(
        name=report.name, type=report.type, generated_by=report.generatedBy,
        date=report.date, format=report.format, status=report.status
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@app.get("/api/v1/reports")
def get_reports_data(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    compliance_items = db.query(ComplianceItem).all()
    history_db = db.query(ReportHistory).order_by(ReportHistory.id.desc()).all()

    total_contracts = len(contracts)
    compliant_contracts = sum(1 for i in compliance_items if i.status == "Compliant")
    expiring_soon = sum(1 for c in contracts if c.status == "Expiring Soon")
    overdue_contracts = sum(1 for c in contracts if c.status == "Overdue") 

    total_value = sum(c.value for c in contracts)
    avg_value = total_value / total_contracts if total_contracts > 0 else 0
    high_value = max((c.value for c in contracts), default=0)
    low_value = min((c.value for c in contracts), default=0)

    active = sum(1 for c in contracts if c.status == "Active")
    pending = sum(1 for c in contracts if c.status == "Pending Review" or c.status == "Pending")
    terminated = sum(1 for c in contracts if c.status == "Terminated")

    dept_map = {}
    for c in contracts:
        dept = c.department if getattr(c, 'department', None) else "General"
        dept_map[dept] = dept_map.get(dept, 0) + 1
    department_chart = [{"name": k, "value": v} for k, v in dept_map.items()]
    if not department_chart: department_chart = [{"name": "None", "value": 0}]

    type_map = {}
    colors_pool = ["#5f27cd", "#3498db", "#f39c12", "#e74c3c", "#2ecc71"]
    for r in history_db:
        r_type = r.type if r.type else "Other"
        type_map[r_type] = type_map.get(r_type, 0) + 1
        
    type_chart = [{"name": k, "value": v, "color": colors_pool[idx % len(colors_pool)]} for idx, (k, v) in enumerate(type_map.items())]
    if not type_chart: type_chart = [{"name": "No Reports Run", "value": 1, "color": "#e0e0e0"}]

    insights = []
    if total_contracts > 0:
        compliant_pct = round((compliant_contracts / total_contracts) * 100)
        insights.append({"title": f"{compliant_contracts} contracts are active and compliant", "subtext": f"{compliant_pct}% of total contracts", "icon": "✅", "color": "#2ecc71"})
    else:
        insights.append({"title": "0 contracts are active and compliant", "subtext": "0% of total contracts", "icon": "✅", "color": "#2ecc71"})
        
    insights.append({"title": f"{expiring_soon} contracts are expiring soon", "subtext": "Action required in next 30 days", "icon": "⏱️", "color": "#f39c12"})
    insights.append({"title": f"{overdue_contracts} contracts are overdue", "subtext": "Immediate attention required", "icon": "❗", "color": "#e74c3c"})
    insights.append({"title": f"Total contract value is ${total_value:,.0f}", "subtext": "Calculated from active database", "icon": "📄", "color": "#5f27cd"})

    recent_reports = [{
        "id": r.id, "name": r.name, "type": r.type, "generatedBy": r.generated_by, "date": r.date, "format": r.format, "status": r.status
    } for r in history_db[:6]]

    return {
        "kpi": { "total": total_contracts, "compliant": compliant_contracts, "expiring": expiring_soon, "overdue": overdue_contracts },
        "statusChart": [
            {"name": "Active", "value": active, "color": "#5f27cd"},
            {"name": "Pending", "value": pending, "color": "#3498db"},
            {"name": "Expiring Soon", "value": expiring_soon, "color": "#f39c12"},
            {"name": "Overdue", "value": overdue_contracts, "color": "#e74c3c"},
            {"name": "Terminated", "value": terminated, "color": "#2ecc71"}
        ],
        "departmentChart": department_chart, "typeChart": type_chart,
        "valueSummary": { "total": f"${total_value:,.0f}", "average": f"${avg_value:,.0f}", "highest": f"${high_value:,.0f}", "lowest": f"${low_value:,.0f}" },
        "recentReports": recent_reports, "insights": insights
    }

def parse_size_to_mb(size_str):
    if not size_str or size_str == "-": return 0
    s = size_str.upper()
    try:
        val = float(''.join(c for c in s if c.isdigit() or c == '.'))
        if "GB" in s: return val * 1024
        if "KB" in s: return val / 1024
        return val
    except:
        return 0

@app.get("/api/v1/documents")
def get_documents_data(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.id.desc()).all()
    contracts = db.query(Contract).all()
    users = db.query(User).all()
    
    total_docs = sum(1 for d in docs if not d.is_folder)
    total_folders = sum(1 for d in docs if d.is_folder)
    
    total_mb = sum(parse_size_to_mb(d.size) for d in docs if not d.is_folder)
    storage_used_gb = round(total_mb / 1024, 2)
    storage_max_gb = 20.0
    storage_pct = round((storage_used_gb / storage_max_gb) * 100) if storage_max_gb > 0 else 0
    
    recently_added = 0
    for d in docs:
        try:
            doc_date = datetime.strptime(d.date, "%b %d, %Y")
            if (datetime.now() - doc_date).days <= 7: recently_added += 1
        except: pass 
            
    expiring_soon_contracts = [c.name for c in contracts if c.status == "Expiring Soon"]
    expiring_soon_docs = sum(1 for d in docs if d.contract_name in expiring_soon_contracts)
    
    table_data = [{
        "id": d.id, "isFolder": d.is_folder, "name": d.name, "sub": d.sub,
        "type": d.type, "typeColor": d.type_color, "contractId": d.contract_id,
        "contractName": d.contract_name, "uploader": d.uploader, 
        "date": d.date, "time": d.time, "size": d.size, "parentId": d.parent_id
    } for d in docs]

    # Synced live contracts matching format CON-YYYY-XXX
    formatted_contracts = [{"contractId": f"CON-{datetime.now().year}-{c.id:03d}", "name": c.name} for c in contracts]
    
    # Synced live users
    db_users = [u.name for u in users if u.name]
    doc_users = [d.uploader for d in docs if d.uploader]
    all_users = sorted(list(set(db_users + doc_users)))
    
    return {
        "kpi": {
            "totalDocuments": total_docs, "totalFolders": total_folders,
            "storageUsedGB": storage_used_gb, "storageMaxGB": storage_max_gb,
            "storagePercent": storage_pct, "recentlyAdded": recently_added,
            "expiringSoon": expiring_soon_docs
        },

        "recentReports": recent_reports,
        "insights": insights
    }

{

        "documents": table_data,
        "contracts": formatted_contracts,
        "users": all_users
    }

class DocumentCreate(BaseModel):
    is_folder: bool
    name: str
    type: str
    size: str
    uploader: str
    parent_id: Optional[int] = None
    contract_id: Optional[str] = "-"
    contract_name: Optional[str] = ""

@app.post("/api/v1/documents")
def add_document(doc: DocumentCreate, db: Session = Depends(get_db)):
    new_doc = Document(
        is_folder=doc.is_folder, name=doc.name, sub="0 files" if doc.is_folder else doc.type,
        type="Folder" if doc.is_folder else doc.type, type_color="#8e44ad" if doc.is_folder else "#e74c3c",
        contract_id=doc.contract_id, contract_name=doc.contract_name, uploader=doc.uploader,
        date=datetime.now().strftime("%b %d, %Y"), time=datetime.now().strftime("%I:%M %p"),
        size=doc.size if not doc.is_folder else "-", parent_id=doc.parent_id
    )
    db.add(new_doc)
    db.flush() 
    
    item_type = "Folder" if doc.is_folder else "Document"
    notif = AppNotification(
        message=f"New {item_type} '{doc.name}' was added by {doc.uploader}.",
        time=datetime.now().strftime("%I:%M %p")
    )
    db.add(notif)
    db.commit()
    
    return {"message": "Successfully added", "id": new_doc.id}

@app.get("/api/v1/notifications")
def get_notifications(db: Session = Depends(get_db)):
    notifs = db.query(AppNotification).order_by(AppNotification.id.desc()).limit(5).all()
    return [{"id": n.id, "message": n.message, "time": n.time, "isRead": n.is_read} for n in notifs]
