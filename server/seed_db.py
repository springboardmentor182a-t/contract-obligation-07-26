"""
Seed script for ContractIQ database.
Populates clean, deduplicated, realistic enterprise data across all models.
"""
import os
from datetime import date, datetime, timedelta
from pathlib import Path
import sys

# Add server directory to path
SERVER_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SERVER_DIR))

import src.database.core as db_core
from src.database.models import (
    User, UserSetting, Notification, ObligationModel, UserInvitation,
    ApiKey, AnalyticsSnapshot, MonthlyVolume, QuickAction, QuickActionLog,
    FAQ, SupportTicket, AuditLogModel, ComplianceControl, ComplianceLog
)
from src.contract_repository.models import Contract, ContractDocument
from src.renewals.models import Renewal

def seed_database():
    db_core.initialize_database()
    db = db_core.SessionLocal()

    try:
        print("Creating tables if missing...")
        db_core.Base.metadata.create_all(bind=db_core.engine)

        # -------------------------------------------------------------
        # 1. USERS & PROFILES
        # -------------------------------------------------------------
        users_data = [
            {
                "full_name": "Arjun Mehta",
                "name": "Arjun Mehta",
                "email": "arjun.mehta@contractiq.com",
                "password": db_core.hash_password("Password@123") if hasattr(db_core, "hash_password") else "$2b$12$8K1p/a0dL1LXMIgoEDDhiO69j0aFz07LwX9S6tH.K9L5L9bL1hW1m",
                "role": "Administrator",
                "department": "Legal Operations",
                "job_title": "Compliance Lead & Admin",
                "phone": "+1 (555) 019-2834",
                "bio": "Senior legal operations leader overseeing vendor contracts, compliance strategy, and cross-functional legal reviews.",
                "status": "Active",
                "is_active": True
            },
            {
                "full_name": "Priya Nair",
                "name": "Priya Nair",
                "email": "priya.nair@contractiq.com",
                "password": db_core.hash_password("Password@123") if hasattr(db_core, "hash_password") else "$2b$12$8K1p/a0dL1LXMIgoEDDhiO69j0aFz07LwX9S6tH.K9L5L9bL1hW1m",
                "role": "Legal Manager",
                "department": "Legal & Corporate Affairs",
                "job_title": "Senior Legal Manager",
                "phone": "+1 (555) 014-9921",
                "bio": "Specializes in IT procurement, IP licensing, and SaaS agreement negotiations.",
                "status": "Active",
                "is_active": True
            },
            {
                "full_name": "Michael Brown",
                "name": "Michael Brown",
                "email": "michael.brown@contractiq.com",
                "password": db_core.hash_password("Password@123") if hasattr(db_core, "hash_password") else "$2b$12$8K1p/a0dL1LXMIgoEDDhiO69j0aFz07LwX9S6tH.K9L5L9bL1hW1m",
                "role": "Compliance Officer",
                "department": "Risk & Compliance",
                "job_title": "Chief Compliance Officer",
                "phone": "+1 (555) 018-3342",
                "bio": "Drives regulatory compliance, SOC2 audits, and data privacy safeguards.",
                "status": "Active",
                "is_active": True
            },
            {
                "full_name": "Sarah Jenkins",
                "name": "Sarah Jenkins",
                "email": "sarah.jenkins@contractiq.com",
                "password": db_core.hash_password("Password@123") if hasattr(db_core, "hash_password") else "$2b$12$8K1p/a0dL1LXMIgoEDDhiO69j0aFz07LwX9S6tH.K9L5L9bL1hW1m",
                "role": "Contract Manager",
                "department": "Procurement",
                "job_title": "Procurement Lead",
                "phone": "+1 (555) 012-7741",
                "bio": "Manages strategic vendor relationships and commercial SLA compliance.",
                "status": "Active",
                "is_active": True
            }
        ]

        for u in users_data:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user_obj = User(**u)
                db.add(user_obj)
            else:
                for k, v in u.items():
                    setattr(existing, k, v)
        db.commit()
        print("Users seeded/updated successfully.")

        # -------------------------------------------------------------
        # 2. CONTRACT REPOSITORY (DEDUPLICATED & RICH)
        # -------------------------------------------------------------
        contracts_data = [
            {
                "contract_name": "Microsoft Office 365 Enterprise License",
                "contract_number": "CTR-2026-001",
                "vendor": "Microsoft Corporation",
                "department": "IT Operations",
                "contract_type": "Software License",
                "start_date": date(2026, 1, 1),
                "end_date": date(2027, 1, 1),
                "contract_value": 250000.0,
                "status": "Active",
                "risk_level": "Low",
                "owner": "Arjun Mehta",
                "renewal_type": "Automatic",
                "description": "Enterprise license agreement for Microsoft Office 365 apps, Teams, and OneDrive across all global teams."
            },
            {
                "contract_name": "Salesforce CRM Unlimited Agreement",
                "contract_number": "CTR-2026-002",
                "vendor": "Salesforce Inc.",
                "department": "Sales & Revenue",
                "contract_type": "Cloud Services",
                "start_date": date(2025, 6, 15),
                "end_date": date(2027, 6, 15),
                "contract_value": 1800000.0,
                "status": "Active",
                "risk_level": "Low",
                "owner": "Priya Nair",
                "renewal_type": "Manual",
                "description": "Global enterprise CRM licenses, Sales Cloud, and Service Cloud subscription with 99.9% uptime SLA."
            },
            {
                "contract_name": "VMware vSphere Virtualization Suite",
                "contract_number": "CTR-2026-003",
                "vendor": "VMware",
                "department": "IT Operations",
                "contract_type": "Infrastructure",
                "start_date": date(2025, 8, 1),
                "end_date": date(2026, 7, 15),
                "contract_value": 430000.0,
                "status": "Expired",
                "risk_level": "High",
                "owner": "Priya Nair",
                "renewal_type": "Manual",
                "description": "Virtualization suite for core datacenter servers. Requires immediate renewal negotiation."
            },
            {
                "contract_name": "Cisco Core Infrastructure Support",
                "contract_number": "CTR-2026-004",
                "vendor": "Cisco Systems",
                "department": "Network Engineering",
                "contract_type": "Cloud Services",
                "start_date": date(2025, 9, 1),
                "end_date": date(2026, 8, 25),
                "contract_value": 450000.0,
                "status": "Expiring",
                "risk_level": "Medium",
                "owner": "Michael Brown",
                "renewal_type": "Manual",
                "description": "Hardware maintenance, 24/7 Smart Net Total Care, and router firmware upgrades."
            },
            {
                "contract_name": "AWS Hosting Master Services Agreement",
                "contract_number": "CTR-2026-005",
                "vendor": "Amazon Web Services",
                "department": "Engineering",
                "contract_type": "Infrastructure",
                "start_date": date(2025, 4, 1),
                "end_date": date(2028, 3, 31),
                "contract_value": 3500000.0,
                "status": "Active",
                "risk_level": "Low",
                "owner": "Arjun Mehta",
                "renewal_type": "Automatic",
                "description": "Primary cloud compute, S3 storage, and RDS database hosting commitment with reserved instance discounts."
            },
            {
                "contract_name": "Deloitte Annual Financial Audit Services",
                "contract_number": "CTR-2026-006",
                "vendor": "Deloitte & Touche",
                "department": "Finance & Audit",
                "contract_type": "Professional Services",
                "start_date": date(2026, 1, 15),
                "end_date": date(2026, 11, 30),
                "contract_value": 1250000.0,
                "status": "Draft",
                "risk_level": "Medium",
                "owner": "Arjun Mehta",
                "renewal_type": "Manual",
                "description": "External audit engagement, annual tax filings, and SOX-404 IT control reviews."
            },
            {
                "contract_name": "Ogilvy Global Brand Retainer",
                "contract_number": "CTR-2026-007",
                "vendor": "Ogilvy & Mather",
                "department": "Marketing",
                "contract_type": "Marketing",
                "start_date": date(2026, 4, 1),
                "end_date": date(2027, 4, 15),
                "contract_value": 600000.0,
                "status": "Active",
                "risk_level": "Low",
                "owner": "Sarah Jenkins",
                "renewal_type": "Manual",
                "description": "Brand strategy, digital creative campaigns, and quarterly media production services."
            },
            {
                "contract_name": "CrowdStrike Falcon Endpoint Security",
                "contract_number": "CTR-2026-008",
                "vendor": "CrowdStrike Inc.",
                "department": "Cybersecurity",
                "contract_type": "Security Software",
                "start_date": date(2025, 8, 10),
                "end_date": date(2026, 8, 10),
                "contract_value": 920000.0,
                "status": "Expiring",
                "risk_level": "High",
                "owner": "Michael Brown",
                "renewal_type": "Manual",
                "description": "Endpoint protection, threat hunting, and automated incident response coverage for 2,500 endpoints."
            },
            {
                "contract_name": "Oracle Database Enterprise License",
                "contract_number": "CTR-2026-009",
                "vendor": "Oracle Corporation",
                "department": "Database Admin",
                "contract_type": "Software License",
                "start_date": date(2026, 7, 1),
                "end_date": date(2027, 12, 31),
                "contract_value": 2200000.0,
                "status": "Draft",
                "risk_level": "Low",
                "owner": "Priya Nair",
                "renewal_type": "Manual",
                "description": "Enterprise database license with Real Application Clusters (RAC) and Partitioning extensions."
            },
            {
                "contract_name": "Workday HCM & Payroll SaaS Agreement",
                "contract_number": "CTR-2026-010",
                "vendor": "Workday Inc.",
                "department": "Human Resources",
                "contract_type": "HR Tech",
                "start_date": date(2025, 10, 1),
                "end_date": date(2027, 9, 30),
                "contract_value": 1400000.0,
                "status": "Active",
                "risk_level": "Low",
                "owner": "Sarah Jenkins",
                "renewal_type": "Automatic",
                "description": "Human Capital Management, payroll processing, and benefits administration platform."
            }
        ]

        for c in contracts_data:
            existing = db.query(Contract).filter(Contract.contract_number == c["contract_number"]).first()
            if not existing:
                db.add(Contract(**c))
            else:
                for k, v in c.items():
                    setattr(existing, k, v)
        db.commit()
        print("Contracts seeded/deduplicated successfully.")

        # -------------------------------------------------------------
        # 3. RENEWALS
        # -------------------------------------------------------------
        db.query(Renewal).delete()
        renewals_data = [
            {
                "contract_name": "Cisco Core Infrastructure Support",
                "vendor": "Cisco Systems",
                "expiry_date": date(2026, 8, 25),
                "renewal_date": date(2026, 8, 1),
                "contract_value": 450000.0,
                "confidence": 88,
                "recommendation": "Renew with 3-year multi-year tier discount (+15% savings)",
                "status": "Expiring Soon",
                "approval_status": "Approved",
                "department": "Network Engineering"
            },
            {
                "contract_name": "CrowdStrike Falcon Endpoint Security",
                "vendor": "CrowdStrike Inc.",
                "expiry_date": date(2026, 8, 10),
                "renewal_date": date(2026, 7, 28),
                "contract_value": 920000.0,
                "confidence": 92,
                "recommendation": "Urgent renewal — add 500 mobile endpoint licenses",
                "status": "Action Needed",
                "approval_status": "Pending Review",
                "department": "Cybersecurity"
            },
            {
                "contract_name": "Deloitte Annual Audit Services",
                "vendor": "Deloitte & Touche",
                "expiry_date": date(2026, 11, 30),
                "renewal_date": date(2026, 10, 15),
                "contract_value": 1250000.0,
                "confidence": 78,
                "recommendation": "Review scope changes for Q4 SOX compliance before signoff",
                "status": "Upcoming",
                "approval_status": "In Negotiation",
                "department": "Finance & Audit"
            }
        ]
        for r in renewals_data:
            db.add(Renewal(**r))
        db.commit()
        print("Renewals seeded successfully.")

        # -------------------------------------------------------------
        # 4. OBLIGATIONS
        # -------------------------------------------------------------
        db.query(ObligationModel).delete()
        admin_user = db.query(User).first()
        first_contract = db.query(Contract).first()
        admin_id = admin_user.id if admin_user else 1
        contract_id = first_contract.id if first_contract else 1

        obligations_data = [
            {
                "title": "Annual SOC2 Type II Attestation Audit",
                "description": "Submit updated SOC2 audit report to enterprise clients",
                "contract_id": contract_id,
                "owner_id": admin_id,
                "priority": "High",
                "status": "Pending",
                "due_date": date(2026, 8, 30)
            },
            {
                "title": "Quarterly SLA Performance Review",
                "description": "Verify 99.9% uptime compliance on Salesforce CRM instance",
                "contract_id": contract_id,
                "owner_id": admin_id,
                "priority": "Medium",
                "status": "Completed",
                "due_date": date(2026, 7, 15)
            },
            {
                "title": "VMware License True-Up & Renewal Notice",
                "description": "Execute true-up count for vSphere licenses prior to contract expiry",
                "contract_id": contract_id,
                "owner_id": admin_id,
                "priority": "High",
                "status": "Overdue",
                "due_date": date(2026, 7, 1)
            }
        ]
        for o in obligations_data:
            db.add(ObligationModel(**o))
        db.commit()
        print("Obligations seeded successfully.")

        print("SUCCESS: Database successfully seeded with clean, deduplicated data.")

    except Exception as err:
        db.rollback()
        print("ERROR seeding database:", err)
        raise err
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
