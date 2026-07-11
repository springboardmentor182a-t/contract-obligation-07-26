# server/seed.py
from sqlalchemy.orm import Session
from src.database.core import SessionLocal, engine, Base
from src.entities.compliance import ComplianceItem
from datetime import date, timedelta
import random

Base.metadata.create_all(bind=engine)

def seed_data():
    db: Session = SessionLocal()
    
    db.query(ComplianceItem).delete()
    
    statuses = ['Compliant', 'At Risk', 'Non-Compliant', 'Pending Review']
    risk_levels = ['Low', 'Medium', 'High']
    item_names = [
        'Data Privacy Compliance', 'Payment Terms Compliance', 
        'Software License Compliance', 'Insurance Coverage', 
        'Service Level Compliance', 'Environmental Compliance', 
        'Security Standards', 'Audit Rights Compliance',
        'SLA Reporting', 'Data Encryption Standards',
        'Vendor Risk Assessment', 'Employee Background Checks'
    ]
    obligations = [
        'GDPR Data Protection', 'Net 30 Days', 'License Renewal',
        'General Liability', 'Uptime >= 99.9%', 'ESG Requirements',
        'ISO 27001 Assessment', 'Annual Audit', 'Monthly Report',
        'AES-256 Encryption', 'Third-party Risk Review', 'HR Screening'
    ]
    
    compliance_items = []
    
    for i in range(1, 151):
        status = random.choices(statuses, weights=[60, 15, 10, 15])[0]
        
        if status == 'Compliant':
            risk = 'Low'
        elif status == 'At Risk':
            risk = random.choice(['Low', 'Medium'])
        elif status == 'Non-Compliant':
            risk = random.choice(['Medium', 'High'])
        else:
            risk = random.choice(['Low', 'Medium', 'High'])
            
        idx = random.randint(0, len(item_names) - 1)
        item = item_names[idx]
        obligation = obligations[idx]
        
        last_rev = date(2026, random.randint(1, 6), random.randint(1, 28))
        
        if status == 'Non-Compliant':
            next_rev = date.today() - timedelta(days=random.randint(1, 45))
        else:
            next_rev = date.today() + timedelta(days=random.randint(2, 120))
            
        img_id = random.randint(1, 70)
        
        compliance_items.append(
            ComplianceItem(
                contract_id=f"CON-2026-{i:03d}",
                item_name=item,
                description=f"Standard requirement for {item}",
                obligation=obligation,
                status=status,
                risk_level=risk,
                last_review=last_rev,
                next_review=next_rev,
                owner_img=f"https://i.pravatar.cc/150?img={img_id}"
            )
        )
        
    db.add_all(compliance_items)
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_data()