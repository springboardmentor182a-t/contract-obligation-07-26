import os
import uuid
from sqlalchemy.orm import Session
from src.database.db import engine, Base
from src.database.models import User, Contract, Notification, AuditLog, Renewal
from datetime import datetime, timedelta

# 1. Create all tables in PostgreSQL
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

def seed():
    with Session(bind=engine) as db:
        # Create Demo User
        demo_user = User(
            user_id="demo@contractiq.com",
            name="Demo",
            full_name="Demo User",
            email="demo@contractiq.com",
            password_hash="demo_hash",
            role="admin",
            status="active"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

        # Create Contracts
        c1 = Contract(
            contract_id="CTR-001", vendor="Acme Corp", 
            type="Sales", status="Active", value=150000.00,
            owner="Alice Smith", date=datetime.now().date() - timedelta(days=90),
            risk="Low", department="Sales"
        )
        c2 = Contract(
            contract_id="CTR-002", vendor="TechFlow", 
            type="Vendor", status="Pending Renewal", value=45000.00,
            owner="Bob Jones", date=datetime.now().date() - timedelta(days=365),
            risk="High", department="Procurement"
        )
        c3 = Contract(
            contract_id="CTR-003", vendor="GlobalReach", 
            type="NDA", status="Expired", value=0.00,
            owner="Charlie Brown", date=datetime.now().date() - timedelta(days=400),
            risk="Medium", department="Legal"
        )
        db.add_all([c1, c2, c3])
        db.commit()
        db.refresh(c1)
        db.refresh(c2)
        db.refresh(c3)
        
        # Add Renewals (for the renewal dashboard)
        r1 = Renewal(contract_id=c2.id, renewal_date=datetime.now().date() + timedelta(days=15), status="Pending")
        r2 = Renewal(contract_id=c1.id, renewal_date=datetime.now().date() + timedelta(days=275), status="Upcoming")
        db.add_all([r1, r2])

        # Create Notifications
        notifications = [
            Notification(
                notification_id=str(uuid.uuid4()),
                user_id="demo@contractiq.com",
                type="Alert",
                title="Renewal Due",
                message="TechFlow Vendor Agreement is pending renewal in 15 days.",
                is_read=False
            ),
            Notification(
                notification_id=str(uuid.uuid4()),
                user_id="demo@contractiq.com",
                type="Info",
                title="Contract Activated",
                message="Acme Corp Enterprise License was successfully activated.",
                is_read=True
            ),
            Notification(
                notification_id=str(uuid.uuid4()),
                user_id="demo@contractiq.com",
                type="Warning",
                title="Contract Expired",
                message="GlobalReach NDA has expired.",
                is_read=False
            )
        ]
        db.add_all(notifications)
        
        # Create Audit Logs (Recent Activity)
        logs = [
            AuditLog(
                actor="Demo User",
                action="Created contract",
                target="InnovateX Partnership",
                category="Contract",
                ip_address="192.168.1.1"
            ),
            AuditLog(
                actor="System",
                action="Changed status to Pending Renewal",
                target="TechFlow Vendor Agreement",
                category="Contract",
                ip_address="127.0.0.1"
            ),
            AuditLog(
                actor="Acme Corp",
                action="Signed the Enterprise License",
                target="Acme Corp Enterprise License",
                category="Contract",
                ip_address="203.0.113.5"
            )
        ]
        db.add_all(logs)
        
        db.commit()
        print("Database successfully seeded!")

if __name__ == "__main__":
    seed()
