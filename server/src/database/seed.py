import datetime
import random
from src.database.db import engine, Base, SessionLocal
from src.database.models import User, Contract, Obligation, Renewal

def seed_data():
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    print("Seeding Users...")
    users = [
        User(user_id=f"USR-10{i}", name=f"User {i}", email=f"user{i}@company.com", role="Admin" if i==1 else "Manager", status="Active", lastLogin="2026-07-20")
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
            date=datetime.date(2026, 1, 1) + datetime.timedelta(days=random.randint(0, 180))
        )
        contracts.append(c)
    db.add_all(contracts)
    db.commit()

    print("Seeding Obligations & Renewals...")
    obligations = []
    renewals = []
    for c in contracts:
        # Create 1-3 obligations per contract
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
        
        # 1 renewal per contract
        r = Renewal(
            contract_id=c.id,
            renewal_date=c.date + datetime.timedelta(days=365),
            status=random.choice(["Upcoming", "Processed", "Pending"])
        )
        renewals.append(r)
        
    db.add_all(obligations)
    db.add_all(renewals)
        
    print("Seeding Additional Data...")
    from src.database.models import Transaction, AuditLog, TaxEstimator, Notification
    from src.notifications.controller import ensure_initial_notifications
    
    transactions = [
        Transaction(transaction_id="TRX-101", date="Oct 12, 2026", description="Payment for Contract A", amount="$4,200.00", status="Completed"),
        Transaction(transaction_id="TRX-102", date="Oct 15, 2026", description="Vendor Retainer", amount="$1,500.00", status="Completed"),
        Transaction(transaction_id="TRX-103", date="Oct 18, 2026", description="Consulting Fees", amount="$3,800.00", status="Pending"),
        Transaction(transaction_id="TRX-104", date="Oct 20, 2026", description="Software License", amount="$5,100.00", status="Completed"),
        Transaction(transaction_id="TRX-105", date="Oct 22, 2026", description="Office Supplies", amount="$900.00", status="Failed"),
        Transaction(transaction_id="TRX-106", date="Oct 25, 2026", description="Marketing Ad Spend", amount="$2,300.00", status="Completed"),
    ]
    db.add_all(transactions)

    a = AuditLog(time="2026-07-12 09:42 AM", user="Admin User", action="Login", target="System", ip="192.168.1.45")
    db.add(a)

    import json
    bd = [
        {"category": "Federal", "amount": "$8,500"},
        {"category": "State", "amount": "$3,200"},
        {"category": "Local", "amount": "$750"}
    ]
    te = TaxEstimator(estimatedTax="$12,450", taxRate="15%", deductions="$3,200", netIncome="$85,000", breakdown=json.dumps(bd))
    db.add(te)
    db.commit()

    ensure_initial_notifications(db)
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_data()
