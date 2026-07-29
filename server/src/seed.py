from datetime import date, timedelta
from src.database.core import engine, SessionLocal
# --- UPDATED: Imported Document ---
from src.database.models import Base, Contract, Activity, Deadline, ComplianceItem, ReportHistory, Document

# Drop and recreate tables to ensure the new ComplianceItem, ReportHistory, and Document tables exist
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def seed_db():
    db = SessionLocal()
    today = date.today()
    
    # --- 1. Existing Contracts (UPDATED with departments) ---
    contracts = [
        Contract(name="Cloud Hosting SLA", party="AWS", status="Active", start_date=date(2023, 1, 1), end_date=date(2025, 1, 1), value=12000.00, department="IT"),
        Contract(name="Office Lease", party="WeWork", status="Expiring Soon", start_date=date(2022, 6, 1), end_date=date(2024, 6, 1), value=45000.00, department="Operations"),
        Contract(name="Software License", party="Microsoft", status="Active", start_date=date(2024, 1, 15), end_date=date(2025, 1, 14), value=5000.00, department="IT")
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

    # --- 4. Compliance Items ---
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

    # --- 5. NEW: Documents ---
    documents = [
        Document(is_folder=True, name="Master Service Agreements", sub="12 files", type="Folder", contract_id="-", contract_name="", uploader="Ananya Sharma", date="Jun 20, 2025", time="10:30 AM", size="-"),
        Document(is_folder=True, name="Insurance Documents", sub="8 files", type="Folder", contract_id="-", contract_name="", uploader="Rahul Mehta", date="Jun 18, 2025", time="02:15 PM", size="-"),
        Document(is_folder=False, name="Master Services Agreement.pdf", sub="Agreement", type="PDF", type_color="#e74c3c", contract_id="CON-2024-001", contract_name="Master Services Agreement", uploader="Ananya Sharma", date="Jun 20, 2025", time="10:30 AM", size="2.4 MB"),
        Document(is_folder=False, name="SOW - Project Alpha.docx", sub="Statement of Work", type="DOCX", type_color="#3498db", contract_id="CON-2024-001", contract_name="Master Services Agreement", uploader="Rahul Mehta", date="Jun 19, 2025", time="11:20 AM", size="1.8 MB"),
        Document(is_folder=False, name="Insurance Certificate.pdf", sub="Certificate", type="PDF", type_color="#e74c3c", contract_id="CON-2024-003", contract_name="Insurance Coverage", uploader="Neha Kapoor", date="Jun 18, 2025", time="09:45 AM", size="1.2 MB"),
        Document(is_folder=False, name="Payment Schedule.xlsx", sub="Payment", type="XLSX", type_color="#2ecc71", contract_id="CON-2024-002", contract_name="Software License Agreement", uploader="Arjun Mehta", date="Jun 17, 2025", time="04:50 PM", size="512 KB"),
        Document(is_folder=False, name="NDA_signed.pdf", sub="Agreement", type="PDF", type_color="#e74c3c", contract_id="CON-2024-004", contract_name="NDA Agreement", uploader="Pooja Singh", date="Jun 16, 2025", time="03:30 PM", size="890 KB"),
        Document(is_folder=False, name="Compliance Training Deck.pptx", sub="Presentation", type="PPTX", type_color="#e67e22", contract_id="-", contract_name="", uploader="Ananya Sharma", date="Jun 15, 2025", time="01:10 PM", size="3.6 MB"),
        Document(is_folder=True, name="Audit Reports", sub="15 files", type="Folder", contract_id="-", contract_name="", uploader="Rahul Mehta", date="Jun 14, 2025", time="10:00 AM", size="-"),
        Document(is_folder=False, name="Vendor Evaluation Report.pdf", sub="Report", type="PDF", type_color="#e74c3c", contract_id="CON-2024-005", contract_name="Vendor Agreement", uploader="Neha Kapoor", date="Jun 13, 2025", time="05:25 PM", size="1.5 MB"),
    ]
    db.add_all(documents)

    # Save everything to PostgreSQL
    db.commit()
    db.close()
    print("Database successfully wiped, tables recreated, and seeded with fresh data including Documents and Report History!")

if __name__ == "__main__":
    seed_db()