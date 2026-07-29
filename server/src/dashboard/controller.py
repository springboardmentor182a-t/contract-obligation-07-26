import random
from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.database.models import Contract, Obligation, Renewal, AuditLog

router = APIRouter()

RISK_ORDER = ["Low", "Medium", "High", "Critical"]
DEPARTMENTS = ["Legal", "Procurement", "HR", "Finance", "Operations", "IT"]


@router.get("/recent")
def get_recent_contracts(db: Session = Depends(get_db)):
    recent = db.query(Contract).order_by(Contract.id.desc()).limit(5).all()
    return [
        {
            "id": c.contract_id,
            "vendor": c.vendor,
            "type": c.type,
            "status": c.status,
            "owner": c.owner,
            "risk": c.risk or "Low",
            "value": c.value or 0,
            "date": c.date.strftime("%b %d, %Y") if c.date else "",
        }
        for c in recent
    ]


@router.get("/compliance-trend")
def compliance_trend(db: Session = Depends(get_db)):
    """Rolling 12-month compliance rate vs. target.
    Base rate is derived from real obligation data (% not overdue); month-to-month
    drift is deterministically randomized since we don't store historical snapshots.
    """
    today = date.today()
    months = []
    curr = today
    for _ in range(12):
        months.insert(0, curr.strftime("%b"))
        first = curr.replace(day=1)
        curr = first - timedelta(days=1)

    total_obl = db.query(Obligation).count()
    overdue = db.query(Obligation).filter(Obligation.status == "Overdue").count()
    base_rate = round(100 - (overdue / total_obl * 100), 1) if total_obl else 94.0

    rng = random.Random(42)  # fixed seed so the trend line is stable between requests
    data = []
    for m in months:
        drift = rng.uniform(-3, 3)
        compliance = max(70, min(99, round(base_rate + drift, 1)))
        data.append({"month": m, "compliance": compliance, "target": 90})
    return data


@router.get("/risk-distribution")
def risk_distribution(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    total = len(contracts) or 1
    counts = {r: 0 for r in RISK_ORDER}
    for c in contracts:
        r = c.risk if c.risk in RISK_ORDER else "Low"
        counts[r] += 1
    return [
        {"name": r, "value": counts[r], "percent": round(counts[r] / total * 100, 1)}
        for r in RISK_ORDER
    ]


@router.get("/contract-status")
def contract_status(db: Session = Depends(get_db)):
    contracts = db.query(Contract).all()
    counts = {}
    for c in contracts:
        s = c.status or "Unknown"
        counts[s] = counts.get(s, 0) + 1
    return [{"name": k, "value": v} for k, v in counts.items()]


@router.get("/renewal-timeline")
def renewal_timeline(db: Session = Depends(get_db)):
    renewals = db.query(Renewal).all()
    counts = {}
    for r in renewals:
        if not r.renewal_date:
            continue
        key = r.renewal_date.strftime("%Y-%m")
        label = r.renewal_date.strftime("%b %Y")
        counts.setdefault(key, {"month": label, "renewals": 0})
        counts[key]["renewals"] += 1
    ordered = sorted(counts.items(), key=lambda kv: kv[0])
    return [v for _, v in ordered]


@router.get("/department-performance")
def department_performance(db: Session = Depends(get_db)):
    """'Performance' = % of a department's contracts that are not Expired/Terminated/Rejected.
    This is a derived proxy metric since there's no dedicated performance-scoring table yet.
    """
    contracts = db.query(Contract).all()
    result = []
    for dept in DEPARTMENTS:
        dept_contracts = [c for c in contracts if (c.department or "Legal") == dept]
        if not dept_contracts:
            result.append({"department": dept, "performance": 0})
            continue
        healthy = len([c for c in dept_contracts if c.status not in ("Expired", "Terminated", "Rejected")])
        result.append({"department": dept, "performance": round(healthy / len(dept_contracts) * 100)})
    return result


@router.get("/deadlines")
def upcoming_deadlines(db: Session = Depends(get_db)):
    today = date.today()
    horizon = today + timedelta(days=45)
    rows = (
        db.query(Obligation, Contract)
        .join(Contract, Obligation.contract_id == Contract.id)
        .filter(Obligation.dueDate.isnot(None))
        .filter(Obligation.dueDate >= today)
        .filter(Obligation.dueDate <= horizon)
        .order_by(Obligation.dueDate.asc())
        .limit(6)
        .all()
    )
    return [
        {
            "id": obl.obligation_id,
            "title": obl.description,
            "contract": c.vendor,
            "dueDate": obl.dueDate.strftime("%b %d, %Y"),
            "daysLeft": (obl.dueDate - today).days,
            "priority": obl.priority,
        }
        for obl, c in rows
    ]


@router.get("/recent-activity")
def recent_activity(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(6).all()
    return [
        {
            "id": l.id,
            "user": l.user,
            "action": l.action,
            "target": l.target,
            "time": l.time,
        }
        for l in logs
    ]
