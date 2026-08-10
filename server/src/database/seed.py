import datetime
import random
from src.database.db import engine, Base, SessionLocal
from src.database.models import User, Contract, Obligation, Renewal, Transaction, AuditLog, TaxEstimator, Notification
import uuid

RISK_LEVELS = ["Low", "Medium", "High", "Critical"]
RISK_WEIGHTS = [0.55, 0.25, 0.14, 0.06]
DEPARTMENTS = ["Legal", "Procurement", "HR", "Finance", "Operations", "IT"]

FIRST_NAMES = ["Priya", "Marcus", "Elena", "Chen", "Sarah", "Jordan", "Amara",
               "Kenji", "Isabella", "Rafael", "Nadia", "Aarav"]
LAST_NAMES = ["Volkov", "Andersson", "Patel", "Chen", "Johnson", "Rodriguez",
              "Kim", "Nakamura", "Silva", "Okafor", "Andersson", "Chen"]

AUDIT_ACTIONS = [
    "deactivated user", "assigned owner", "exported report", "signed in",
    "created contract", "approved contract", "updated obligation",
    "uploaded document", "sent reminder", "rejected contract",
]
AUDIT_TARGETS = [
    "Enterprise SaaS License", "Cloud Hosting Agreement", "Equipment Purchase Order",
    "Master Services Agreement", "Non-Disclosure Agreement", "Software Reseller Agreement",
    "Distribution Agreement", "Executive Employment Contract", "Data Processing Addendum",
    "IP Assignment Agreement", "Vendor Supply Contract", "Strategic Partnership MOU",
    "Managed Support Agreement", "Facility Lease Agreement", "Consulting Services",
    "Marketing Services Contract",
]
AUDIT_CATEGORIES = ["Contract", "Obligation", "User", "Approval", "Security", "Auth"]


def seed_data():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    print("Seeding Users...")
    users = [
        User(user_id=f"USR-10{i}", name=f"User {i}", email=f"user{i}@company.com",
             role="Admin" if i == 1 else "Manager", status="Active", lastLogin="2026-07-20")
        for i in range(1, 16)
    ]
    db.add_all(users)

    print("Seeding Contracts...")
    vendors = ["Acme Corp", "TechFlow Inc", "Global Logistics", "CloudSystems", "Marketing Pros", "DataWorks", "SecureNet"]
    types = ["NDA", "MSA", "SLA", "Vendor", "Employment"]
    statuses = ["Active", "Pending", "Expired"]

    contracts = []
    for i in range(1, 20):
        c = Contract(
            contract_id=f"CTR-2026-{i:03d}",
            vendor=random.choice(vendors),
            type=random.choice(types),
            status=random.choice(statuses),
            value=float(random.randint(10, 250) * 1000),
            owner=f"User {random.randint(1, 15)}",
            date=datetime.date(2026, 1, 1) + datetime.timedelta(days=random.randint(0, 180)),
            risk=random.choices(RISK_LEVELS, weights=RISK_WEIGHTS, k=1)[0],
            department=random.choice(DEPARTMENTS),
        )
        contracts.append(c)
    db.add_all(contracts)
    db.commit()

    print("Seeding Obligations & Renewals...")
    obligations = []
    renewals = []
    for c in contracts:
        for j in range(random.randint(1, 3)):
            o = Obligation(
                obligation_id=f"OBL-{c.id:03d}-{j}",
                contract_id=c.id,
                description=f"Obligation {j} for {c.vendor}",
                dueDate=c.date + datetime.timedelta(days=random.randint(10, 90)),
                status=random.choice(["Pending", "In Progress", "Completed", "Overdue"]),
                priority=random.choice(["Low", "Medium", "High", "Critical"])
            )
            obligations.append(o)

        r = Renewal(
            contract_id=c.id,
            renewal_date=c.date + datetime.timedelta(days=365),
            status=random.choice(["Upcoming", "Processed", "Pending"])
        )
        renewals.append(r)

    db.add_all(obligations)
    db.add_all(renewals)

    print("Seeding Additional Data...")
    transactions = [
        Transaction(transaction_id="TRX-101", date="Oct 12, 2026", description="Payment for Contract A", amount="$4,200.00", status="Completed"),
        Transaction(transaction_id="TRX-102", date="Oct 15, 2026", description="Vendor Retainer", amount="$1,500.00", status="Completed"),
        Transaction(transaction_id="TRX-103", date="Oct 18, 2026", description="Consulting Fees", amount="$3,800.00", status="Pending"),
        Transaction(transaction_id="TRX-104", date="Oct 20, 2026", description="Software License", amount="$5,100.00", status="Completed"),
        Transaction(transaction_id="TRX-105", date="Oct 25, 2026", description="Office Supplies", amount="$900.00", status="Failed"),
        Transaction(transaction_id="TRX-106", date="Oct 25, 2026", description="Marketing Ad Spend", amount="$2,300.00", status="Completed"),
    ]
    db.add_all(transactions)

    print("Seeding Audit Logs...")
    now = datetime.datetime(2026, 7, 30, 15, 0, 0)
    audit_logs = []
    ts = now
    for i in range(120):
        # step back a random interval so entries spread across ~7 days
        ts = ts - datetime.timedelta(minutes=random.randint(20, 240))
        actor = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        audit_logs.append(AuditLog(
            timestamp=ts,
            actor=actor,
            action=random.choice(AUDIT_ACTIONS),
            target=random.choice(AUDIT_TARGETS),
            category=random.choice(AUDIT_CATEGORIES),
            ip_address=f"10.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
        ))
    db.add_all(audit_logs)

    import json
    bd = [
        {"category": "Federal", "amount": "$8,500"},
        {"category": "State", "amount": "$3,200"},
        {"category": "Local", "amount": "$750"}
    ]
    te = TaxEstimator(estimatedTax="$12,450", taxRate="15%", deductions="$3,200", netIncome="$85,000", breakdown=json.dumps(bd))
    db.add(te)
    db.commit()

    now_dt = datetime.datetime.utcnow()
    initial_notifs = [
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="renewal",
            title="Action Required: TechFlow Inc MSA Expiring",
            message="TechFlow Inc MSA (CTR-2026-002) is expiring in 15 days. Action required for contract renewal.",
            details="The Master Services Agreement CTR-2026-002 with TechFlow Inc is scheduled to expire in 15 days. Review commercial terms and initiate vendor renewal discussions before expiration.",
            link="/renewals",
            is_read=False,
            created_at=now_dt - datetime.timedelta(minutes=25)
        ),
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="risk",
            title="High Risk Clause Detected: Unlimited Liability",
            message="SecureNet agreement flagged for non-standard indemnification and liability exposure.",
            details="AI Contract Risk Scanner detected clause 14.2 in the SecureNet contract lacks standard limitation of liability caps. VP Legal approval recommended prior to signing.",
            link="/contracts",
            is_read=False,
            created_at=now_dt - datetime.timedelta(hours=1, minutes=45)
        ),
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="obligation",
            title="Upcoming Milestone Deadline: Quarterly True-up",
            message="Quarterly True-up Report obligation for Acme Corp is due in 3 days.",
            details="Obligation OBL-001 requires submission of audited usage reports to Acme Corp before end of week to maintain SLA compliance.",
            link="/obligations",
            is_read=False,
            created_at=now_dt - datetime.timedelta(hours=3, minutes=10)
        ),
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="system",
            title="PostgreSQL Automated Backup Completed",
            message="ContractIQ PostgreSQL database snapshot verified and encrypted in secure vault.",
            details="Daily database snapshot completed with 0 errors. All contract tables, audit logs, and obligation records successfully indexed and archived in PostgreSQL.",
            link="/audit-logs",
            is_read=False,
            created_at=now_dt - datetime.timedelta(hours=5)
        ),
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="approval",
            title="Contract SOW Approved by Legal Review",
            message="Initech Statement of Work (SOW-2026-08) has been approved by Legal Review.",
            details="Legal compliance and risk review completed with zero objections. The agreement is now moved to Pending Signature status.",
            link="/contracts",
            is_read=True,
            created_at=now_dt - datetime.timedelta(days=1, hours=2)
        ),
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="renewal",
            title="Vendor Agreement Auto-Renewal Notice",
            message="Global Logistics agreement (CTR-2026-003) auto-renews in 30 days.",
            details="Notice window for renegotiation or contract termination closes at the end of the current billing cycle. Current annual value: $150,000.",
            link="/renewals",
            is_read=True,
            created_at=now_dt - datetime.timedelta(days=1, hours=6)
        ),
        Notification(
            notification_id=f"NOTIF-{uuid.uuid4().hex[:6].upper()}",
            user_id="all",
            type="system",
            title="SOC2 Compliance Audit Cleared",
            message="Q2 Security and Compliance Audit signed off by Enterprise Security Officer.",
            details="The quarterly compliance audit has been verified with 100% adherence score. All obligation audit logs are synced in the database.",
            link="/compliance",
            is_read=True,
            created_at=now_dt - datetime.timedelta(days=1, hours=11)
        )
    ]
    db.add_all(initial_notifs)
    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
