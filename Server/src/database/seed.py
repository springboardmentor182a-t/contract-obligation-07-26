import sys
import os
from datetime import date, datetime, timedelta

# Add the server's root directory to python path if run directly
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.database.core import SessionLocal, engine
from src.entities.compliance import Base, Compliance
from src.entities.contract import Contract
from src.entities.obligation import Obligation

def seed_db():
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we have at least one contract to satisfy the foreign key constraint
        contract = db.query(Contract).first()
        if not contract:
            print("No contract found. Creating a default contract for compliance records...")
            contract = Contract(
                title="Default Vendor Contract",
                vendor="TechCorp Solutions",
                type="Vendor Contracts",
                value=150000.0,
                end_date=date.today() + timedelta(days=365),
                owner="John Doe",
                status="Active",
                compliance="98%",
            )
            db.add(contract)
            db.commit()
            db.refresh(contract)
            print(f"Created default contract with ID: {contract.contract_id}")
            
        # Clear existing compliance records
        print("Clearing existing compliance records...")
        db.query(Compliance).delete()
        db.commit()
        
        # Standard mockup data matching Compliance.jsx exactly
        mock_records = [
            Compliance(
                requirement="GDPR Data Processing",
                category="Data Privacy",
                entity="TechCorp Solutions",
                contract_id=contract.contract_id,
                status="Compliant",
                risk_level="High",
                last_audit=datetime(2023, 10, 1),
                health_score=98
            ),
            Compliance(
                requirement="ISO 27001 Certification",
                category="Security",
                entity="Cloud Services LLC",
                contract_id=contract.contract_id,
                status="Non-Compliant",
                risk_level="High",
                last_audit=datetime(2023, 9, 15),
                health_score=45
            ),
            Compliance(
                requirement="Annual Background Checks",
                category="HR Policy",
                entity="Staffing Agency",
                contract_id=contract.contract_id,
                status="Under Review",
                risk_level="Medium",
                last_audit=datetime(2023, 11, 5),
                health_score=72
            ),
            Compliance(
                requirement="Anti-Bribery Clause",
                category="Legal",
                entity="GlobalTech",
                contract_id=contract.contract_id,
                status="Compliant",
                risk_level="Low",
                last_audit=datetime(2023, 1, 10),
                health_score=100
            ),
            Compliance(
                requirement="SLA Uptime >= 99.9%",
                category="Operations",
                entity="HostProvider Inc",
                contract_id=contract.contract_id,
                status="Warning",
                risk_level="Medium",
                last_audit=datetime(2023, 11, 20),
                health_score=85
            ),
        ]
        
        print("Adding seed compliance records...")
        db.add_all(mock_records)
        db.commit()
        print("Database seeded successfully with 5 records!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
