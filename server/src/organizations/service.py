from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.database.models import OrganizationModel, User, AuditLogModel
from src.organizations.schemas import OrganizationCreate, OrganizationUpdate

class OrganizationService:
    @staticmethod
    def log_audit(db: Session, user_id: int, action: str, module: str, description: str):
        log_entry = AuditLogModel(
            user_id=user_id,
            event_type="INFO",
            action=action,
            module=module,
            description=description,
            ip_address="127.0.0.1"
        )
        db.add(log_entry)
        db.commit()

    @staticmethod
    def get_organizations(db: Session, current_user: User):
        # A normal user can only see their organization, unless they are admin.
        # But let's assume Admin can see all, others can see their own.
        if current_user.role == "Administrator":
            return db.query(OrganizationModel).all()
        elif current_user.organization_id:
            return db.query(OrganizationModel).filter(OrganizationModel.organization_id == current_user.organization_id).all()
        return []

    @staticmethod
    def get_organization(db: Session, org_id: int):
            
        org = db.query(OrganizationModel).filter(OrganizationModel.organization_id == org_id).first()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
        return org

    @staticmethod
    def create_organization(db: Session, data: OrganizationCreate, current_user: User):
        existing_org = db.query(OrganizationModel).filter(OrganizationModel.offical_email == data.offical_email).first()
        if existing_org:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="An organization with this official email already exists.")
            
        new_org = OrganizationModel(
            organization_type=data.organization_type,
            company_name=data.company_name,
            registration_number=data.registration_number,
            gst_number=data.gst_number,
            contact_number=data.contact_number,
            offical_email=data.offical_email,
            country=data.country,
            state=data.state,
            city=data.city,
            is_active=data.is_active
        )
        db.add(new_org)
        db.commit()
        db.refresh(new_org)
        
        OrganizationService.log_audit(
            db, current_user.id, "Create Organization", "Organizations", f"Created organization: {new_org.company_name or 'N/A'}"
        )
        return new_org

    @staticmethod
    def update_organization(db: Session, org_id: int, data: OrganizationUpdate, current_user: User):
        org = OrganizationService.get_organization(db, org_id, current_user)
        
        if data.organization_type is not None:
            org.organization_type = data.organization_type
        if data.company_name is not None:
            org.company_name = data.company_name
        if data.registration_number is not None:
            org.registration_number = data.registration_number
        if data.gst_number is not None:
            org.gst_number = data.gst_number
        if data.contact_number is not None:
            org.contact_number = data.contact_number
        if data.offical_email is not None:
            org.offical_email = data.offical_email
        if data.country is not None:
            org.country = data.country
        if data.state is not None:
            org.state = data.state
        if data.city is not None:
            org.city = data.city
        if data.is_active is not None:
            org.is_active = data.is_active
            
        db.commit()
        db.refresh(org)
        OrganizationService.log_audit(
            db, current_user.id, "Update Organization", "Organizations", f"Updated organization ID: {org_id}"
        )
        return org

    @staticmethod
    def delete_organization(db: Session, org_id: int, current_user: User):
        if current_user.role != "Administrator":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only administrators can delete organizations")
            
        org = db.query(OrganizationModel).filter(OrganizationModel.organization_id == org_id).first()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
            
        db.delete(org)
        db.commit()
        OrganizationService.log_audit(
            db, current_user.id, "Delete Organization", "Organizations", f"Deleted organization ID: {org_id}"
        )
        return {"detail": "Organization deleted"}

    @staticmethod
    def assign_user(db: Session, org_id: int, user_id: int, current_user: User):
        # Admin or Org Admin (implied by having rights to this org)
        if current_user.role != "Administrator" and current_user.organization_id != org_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to assign users to this organization")
            
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            
        user.organization_id = org_id
        db.commit()
        db.refresh(user)
        OrganizationService.log_audit(
            db, current_user.id, "Assign User", "Organizations", f"Assigned user {user_id} to organization ID: {org_id}"
        )
        return {"detail": f"User {user_id} assigned to organization {org_id}"}
