"""
seed_data.py — Populates the database with realistic demo data for review.
Run: python seed_data.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, engine, Base
import models
from models import (
    User, UserRole, Contract, Renewal, RenewalStatus,
    RenewalApproval, ApprovalStatus, RenewalReminder, RenewalHistory
)
from auth import get_password_hash
from datetime import date, timedelta
import random

Base.metadata.create_all(bind=engine)
db = SessionLocal()

def seed():
    print("🌱 Seeding ContractIQ Renewal Module...")

    # ── Users ────────────────────────────────────────────────────────
    users_data = [
        {"email": "legal.manager@contractiq.com", "full_name": "Sarah Mitchell", "role": UserRole.legal_manager, "dept": "Legal"},
        {"email": "compliance@contractiq.com", "full_name": "David Chen", "role": UserRole.compliance_officer, "dept": "Compliance"},
        {"email": "contracts@contractiq.com", "full_name": "Priya Sharma", "role": UserRole.contract_manager, "dept": "Procurement"},
        {"email": "admin@contractiq.com", "full_name": "Alex Johnson", "role": UserRole.administrator, "dept": "IT"},
        {"email": "hr@contractiq.com", "full_name": "Emma Wilson", "role": UserRole.department_head, "dept": "HR"},
    ]

    created_users = {}
    for u in users_data:
        existing = db.query(User).filter(User.email == u["email"]).first()
        if not existing:
            user = User(
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=get_password_hash("Password@123"),
                role=u["role"],
                department=u["dept"],
                is_active=True
            )
            db.add(user)
            db.flush()
            created_users[u["email"]] = user
            print(f"  ✅ User: {u['full_name']} ({u['role'].value})")
        else:
            created_users[u["email"]] = existing

    db.commit()

    # ── Contracts ────────────────────────────────────────────────────
    today = date.today()
    contracts_data = [
        {"num": "CNT-2024-001", "title": "Cloud Infrastructure Services", "vendor": "AWS Solutions Ltd.", "cat": "Service Agreements", "val": 450000, "start": today - timedelta(days=365), "end": today + timedelta(days=25)},
        {"num": "CNT-2024-002", "title": "Enterprise Software License", "vendor": "Microsoft Corporation", "cat": "Vendor Contracts", "val": 180000, "start": today - timedelta(days=300), "end": today + timedelta(days=55)},
        {"num": "CNT-2024-003", "title": "Office Space Lease Agreement", "vendor": "Prime Commercial Realty", "cat": "Lease Agreements", "val": 240000, "start": today - timedelta(days=730), "end": today + timedelta(days=88)},
        {"num": "CNT-2024-004", "title": "HR Consulting Services", "vendor": "PeopleFirst Consulting", "cat": "Service Agreements", "val": 95000, "start": today - timedelta(days=180), "end": today + timedelta(days=120)},
        {"num": "CNT-2024-005", "title": "Cybersecurity Monitoring", "vendor": "SecureNet Systems", "cat": "Service Agreements", "val": 320000, "start": today - timedelta(days=400), "end": today - timedelta(days=10)},
        {"num": "CNT-2024-006", "title": "Annual Maintenance Contract", "vendor": "TechSupport Pro", "cat": "Vendor Contracts", "val": 65000, "start": today - timedelta(days=200), "end": today + timedelta(days=200)},
        {"num": "CNT-2023-007", "title": "Data Analytics Platform", "vendor": "Tableau Software Inc.", "cat": "Purchase Agreements", "val": 128000, "start": today - timedelta(days=500), "end": today - timedelta(days=90)},
        {"num": "CNT-2024-008", "title": "Legal Research Subscription", "vendor": "LexisNexis Group", "cat": "Vendor Contracts", "val": 42000, "start": today - timedelta(days=60), "end": today + timedelta(days=305)},
    ]

    created_contracts = {}
    for c in contracts_data:
        existing = db.query(Contract).filter(Contract.contract_number == c["num"]).first()
        if not existing:
            contract = Contract(
                contract_number=c["num"], title=c["title"], vendor_name=c["vendor"],
                category=c["cat"], value=c["val"], currency="USD",
                start_date=c["start"], end_date=c["end"], status="active"
            )
            db.add(contract)
            db.flush()
            created_contracts[c["num"]] = contract
            print(f"  ✅ Contract: {c['title']}")
        else:
            created_contracts[c["num"]] = existing

    db.commit()

    # ── Renewals ─────────────────────────────────────────────────────
    manager = created_users.get("legal.manager@contractiq.com") or db.query(User).filter(User.role == UserRole.legal_manager).first()
    compliance = created_users.get("compliance@contractiq.com") or db.query(User).filter(User.role == UserRole.compliance_officer).first()
    cm = created_users.get("contracts@contractiq.com") or db.query(User).filter(User.role == UserRole.contract_manager).first()

    renewals_data = [
        {"num": "RNW-2024-100001", "contract_num": "CNT-2024-001", "status": RenewalStatus.upcoming, "priority": "critical", "end": today + timedelta(days=25), "val": 480000, "mgr": manager},
        {"num": "RNW-2024-100002", "contract_num": "CNT-2024-002", "status": RenewalStatus.in_progress, "priority": "high", "end": today + timedelta(days=55), "val": 195000, "mgr": cm},
        {"num": "RNW-2024-100003", "contract_num": "CNT-2024-003", "status": RenewalStatus.upcoming, "priority": "high", "end": today + timedelta(days=88), "val": 255000, "mgr": compliance},
        {"num": "RNW-2024-100004", "contract_num": "CNT-2024-004", "status": RenewalStatus.upcoming, "priority": "medium", "end": today + timedelta(days=120), "val": 100000, "mgr": manager},
        {"num": "RNW-2024-100005", "contract_num": "CNT-2024-005", "status": RenewalStatus.expired, "priority": "critical", "end": today - timedelta(days=10), "val": 340000, "mgr": cm},
        {"num": "RNW-2024-100006", "contract_num": "CNT-2024-006", "status": RenewalStatus.renewed, "priority": "low", "end": today + timedelta(days=200), "val": 68000, "mgr": manager},
        {"num": "RNW-2023-100007", "contract_num": "CNT-2023-007", "status": RenewalStatus.cancelled, "priority": "medium", "end": today - timedelta(days=90), "val": None, "mgr": compliance},
    ]

    for r in renewals_data:
        existing = db.query(Renewal).filter(Renewal.renewal_number == r["num"]).first()
        if not existing and r["mgr"]:
            contract = created_contracts.get(r["contract_num"])
            if contract:
                renewal = Renewal(
                    renewal_number=r["num"],
                    contract_id=contract.id,
                    manager_id=r["mgr"].id,
                    status=r["status"],
                    original_end_date=r["end"],
                    proposed_end_date=r["end"] + timedelta(days=365) if r["status"] != RenewalStatus.cancelled else None,
                    renewed_end_date=r["end"] + timedelta(days=365) if r["status"] == RenewalStatus.renewed else None,
                    renewal_value=r["val"],
                    priority=r["priority"],
                    notes=f"Auto-generated renewal for {contract.title}",
                    reminder_30_sent=(r["status"] in [RenewalStatus.expired, RenewalStatus.renewed, RenewalStatus.cancelled]),
                    reminder_60_sent=(r["status"] in [RenewalStatus.expired, RenewalStatus.renewed, RenewalStatus.cancelled]),
                    reminder_90_sent=(r["status"] in [RenewalStatus.expired, RenewalStatus.renewed, RenewalStatus.cancelled]),
                )
                db.add(renewal)
                db.flush()

                # Add approval
                approval = RenewalApproval(
                    renewal_id=renewal.id,
                    approver_id=r["mgr"].id,
                    step=1,
                    status=ApprovalStatus.approved if r["status"] in [RenewalStatus.renewed, RenewalStatus.in_progress] else (ApprovalStatus.rejected if r["status"] == RenewalStatus.cancelled else ApprovalStatus.pending),
                    comments="Initial approval review"
                )
                db.add(approval)

                # Add reminders
                for days in [90, 60, 30]:
                    rem_date = r["end"] - timedelta(days=days)
                    reminder = RenewalReminder(
                        renewal_id=renewal.id,
                        reminder_type=f"{days}day",
                        scheduled_date=rem_date,
                        is_sent=(r["status"] in [RenewalStatus.expired, RenewalStatus.renewed]),
                        recipient_email=r["mgr"].email,
                        message=f"[ContractIQ] {days}-day renewal reminder for {contract.title}"
                    )
                    db.add(reminder)

                # Add history
                history_actions = [
                    ("RENEWAL_CREATED", None, "upcoming", "Renewal tracking initiated"),
                ]
                if r["status"] == RenewalStatus.in_progress:
                    history_actions.append(("APPROVAL_GRANTED", "upcoming", "in_progress", "Approved by manager"))
                elif r["status"] == RenewalStatus.renewed:
                    history_actions.append(("APPROVAL_GRANTED", "upcoming", "in_progress", "Approved for renewal"))
                    history_actions.append(("RENEWAL_COMPLETED", "in_progress", "renewed", f"Contract renewed until {r['end'] + timedelta(days=365)}"))
                elif r["status"] == RenewalStatus.expired:
                    history_actions.append(("AUTO_EXPIRED", "upcoming", "expired", "Contract end date passed"))
                elif r["status"] == RenewalStatus.cancelled:
                    history_actions.append(("APPROVAL_REJECTED", "upcoming", "cancelled", "Renewal cancelled"))

                for action, old_s, new_s, remarks in history_actions:
                    hist = RenewalHistory(
                        renewal_id=renewal.id,
                        action=action,
                        old_status=old_s,
                        new_status=new_s,
                        changed_by=r["mgr"].full_name,
                        changed_by_role=r["mgr"].role.value,
                        remarks=remarks
                    )
                    db.add(hist)

                print(f"  ✅ Renewal: {r['num']} ({r['status'].value})")

    db.commit()
    print("\n✅ Seeding complete!")
    print("\n📋 Demo Credentials (password: Password@123):")
    print("  Legal Manager:      legal.manager@contractiq.com")
    print("  Compliance Officer: compliance@contractiq.com")
    print("  Contract Manager:   contracts@contractiq.com")
    print("  (Administrator has NO access to Renewal Module)")
    db.close()

if __name__ == "__main__":
    seed()
