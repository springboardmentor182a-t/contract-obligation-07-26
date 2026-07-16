from datetime import date, timedelta
from src.database.core import engine, SessionLocal
from src.database.models import Base, Contract, Activity, Deadline, ComplianceItem

# Drop and recreate tables to ensure the new ComplianceItem table exists
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    today = date.today()
    
    # --- 1. Existing Contracts ---
    contracts = [
        Contract(name="Cloud Hosting SLA", party="AWS", status="Active", start_date=date(2023, 1, 1), end_date=date(2025, 1, 1), value=12000.00),
        Contract(name="Office Lease", party="WeWork", status="Expiring Soon", start_date=date(2022, 6, 1), end_date=date(2024, 6, 1), value=45000.00),
        Contract(name="Software License", party="Microsoft", status="Active", start_date=date(2024, 1, 15), end_date=date(2025, 1, 14), value=5000.00)
    ]
    db.add_all(contracts)

    # --- 2. Existing Activities ---
    activities = [
        Activity(description="AWS Contract created", time="2 hours ago"),
        Activity(description="WeWork Lease reviewed", time="1 day ago")
    ]
    db.add_all(activities)

    # --- 3. Existing Deadlines ---
    deadlines = [
        Deadline(title="Review Office Lease Renewal", date="2024-05-01"),
        Deadline(title="Pay AWS Invoice", date="2024-02-15")
    ]
    db.add_all(deadlines)

    # --- 4. NEW: Compliance Items ---
    compliance_items = [
        ComplianceItem(
            item_name="Data Privacy Compliance",
            description="GDPR Requirements",
            contract_ref="CON-2024-001",
            obligation="Data Protection",
            status="Compliant",
            risk_level="Low",
            last_review=today - timedelta(days=60),
            next_review=today + timedelta(days=60),
            owner_name="Spandana Doe"
        ),
        ComplianceItem(
            item_name="Payment Terms Compliance",
            description="Net 30 Days",
            contract_ref="CON-2024-001",
            obligation="Payment - Q2 2024",
            status="At Risk",
            risk_level="Medium",
            last_review=today - timedelta(days=30),
            next_review=today + timedelta(days=5),
            owner_name="Spandana Doe"
        ),
        ComplianceItem(
            item_name="Software License Compliance",
            description="License Usage",
            contract_ref="CON-2024-002",
            obligation="Software License Renewal",
            status="Compliant",
            risk_level="Low",
            last_review=today - timedelta(days=120),
            next_review=today + timedelta(days=67),
            owner_name="Spandana Doe"
        ),
        ComplianceItem(
            item_name="Insurance Coverage",
            description="General Liability",
            contract_ref="CON-2024-003",
            obligation="Insurance Certificate",
            status="Non-Compliant",
            risk_level="High",
            last_review=today - timedelta(days=45),
            next_review=today + timedelta(days=14),
            owner_name="Spandana Doe"
        ),
        ComplianceItem(
            item_name="Environmental Compliance",
            description="ESG Requirements",
            contract_ref="CON-2024-004",
            obligation="Sustainability Report",
            status="Pending Review",
            risk_level="Low",
            last_review=None,
            next_review=today + timedelta(days=10),
            owner_name="Spandana Doe"
        )
    ]
    db.add_all(compliance_items)

    # Save everything to PostgreSQL
    db.commit()
    db.close()
    print("Database successfully wiped, tables recreated, and seeded with fresh compliance data!")

if __name__ == "__main__":
    seed_db()