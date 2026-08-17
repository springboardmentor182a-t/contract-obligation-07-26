from datetime import date, datetime
from typing import Optional

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.database.core import Base, engine, get_db
from src.database.models import (
    Contract, Activity, Deadline, ComplianceItem, ReportHistory,
    Document, AppNotification, User, SupportTicket
)

# Routers
from src.auth.controller import router as auth_router
from src.users.controller import router as users_router
from src.contracts.controller import router as contracts_router
from src.documents.controller import router as documents_router
from src.calendar.controller import router as calendar_router
from src.renewals.controller import router as renewals_router
from src.tasks.controller import router as tasks_router


# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ContractIQ API")


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary for testing
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Register Routers
app.include_router(auth_router)
app.include_router(users_router, prefix="/api/v1", tags=["Users"])
app.include_router(contracts_router)
app.include_router(documents_router)
app.include_router(calendar_router, prefix="/api/v1", tags=["Calendar"])
app.include_router(renewals_router, prefix="/api/v1", tags=["Renewals"])
app.include_router(tasks_router, prefix="/api/v1", tags=["Tasks"])

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

    formatted_contracts = [{"contractId": f"CON-{datetime.now().year}-{c.id:03d}", "name": c.name} for c in contracts]
    
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

# --- UPDATED: Unified Live Notifications Engine ---
@app.get("/api/v1/notifications")
def get_notifications(db: Session = Depends(get_db)):
    # 1. Base table notifications (Uploads, Mentions, etc.)
    notifs = db.query(AppNotification).order_by(AppNotification.id.desc()).all()
    
    # 2. Live Alerts: Contracts Expiring Soon
    contracts = db.query(Contract).filter(Contract.status == "Expiring Soon").all()
    
    # 3. Live Alerts: Compliance Items Due/Overdue
    compliance = db.query(ComplianceItem).filter(ComplianceItem.status.in_(["At Risk", "Non-Compliant"])).all()
    
    results = []
    
    # Process DB Notifications (System & Mentions)
    for n in notifs:
        n_type = "System"
        priority = "Low"
        icon = "⚙️"
        iconBg = "#e3f2fd"
        priorityColor = "#2ecc71"
        priorityBg = "#e8f5e9"
        title = "System Update"
        
        if "Document" in n.message or "Folder" in n.message:
            icon = "📄"
            title = "Document Uploaded"
        elif "mentioned" in n.message.lower():
            n_type = "Mentions"
            priority = "Medium"
            icon = "👥"
            iconBg = "#f3e5f5"
            priorityColor = "#f39c12"
            priorityBg = "#fff8e1"
            title = "You were mentioned"
            
        results.append({
            "id": f"sys_{n.id}",
            "isUnread": not n.is_read,
            "icon": icon, "iconBg": iconBg,
            "title": title,
            "desc": n.message,
            "priority": priority, "priorityColor": priorityColor, "priorityBg": priorityBg,
            "time": n.time,
            "type": n_type
        })
        
    # Process Live Contract Alerts
    for c in contracts:
        results.append({
            "id": f"con_{c.id}",
            "isUnread": True,
            "icon": "⚠️", "iconBg": "#feebee",
            "title": "Contract Expiring Soon",
            "desc": f"Master Services Agreement '{c.name}' will expire soon on {c.end_date}.",
            "priority": "High", "priorityColor": "#e74c3c", "priorityBg": "#feebee",
            "time": "Live Alert",
            "type": "Alerts"
        })
        
    # Process Live Compliance Alerts
    for c in compliance:
        is_high = c.status == "Non-Compliant"
        results.append({
            "id": f"comp_{c.id}",
            "isUnread": True,
            "icon": "🗓️", "iconBg": "#fff8e1" if not is_high else "#feebee",
            "title": "Obligation " + ("Overdue" if is_high else "Due Soon"),
            "desc": f"{c.item_name} is marked as {c.status}.",
            "priority": "High" if is_high else "Medium", 
            "priorityColor": "#e74c3c" if is_high else "#f39c12", 
            "priorityBg": "#feebee" if is_high else "#fff8e1",
            "time": "Live Alert",
            "type": "Alerts"
        })
        
    return results

@app.put("/api/v1/notifications/read")
def mark_notifications_read(db: Session = Depends(get_db)):
    db.query(AppNotification).update({"is_read": True})
    db.commit()
    return {"message": "All marked as read"}

# --- Support Tickets Pipeline ---
class TicketCreate(BaseModel):
    name: str
    email: str
    subject: str
    priority: str
    message: str

@app.post("/api/v1/support/tickets")
def create_support_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    db_ticket = SupportTicket(
        name=ticket.name,
        email=ticket.email,
        subject=ticket.subject,
        priority=ticket.priority,
        message=ticket.message,
        status="Open",
        updated_on=datetime.now().strftime("%d %b %Y")
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@app.get("/api/v1/support/tickets")
def get_support_tickets(db: Session = Depends(get_db)):
    return db.query(SupportTicket).order_by(SupportTicket.id.desc()).all()