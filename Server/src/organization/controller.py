from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from entities.organization import Organization
from database.core import get_db
from entities.user import User
from users.service import admin_required
from organization.models import (
    OrganizationResponse,
    OrganizationUpdate,
    OrganizationCreate,
)

router = APIRouter(
    prefix="/organization",
    tags=["Organization"],
)


@router.post("/create_organization", response_model=OrganizationResponse)
def create_organization(
    organization_data: OrganizationCreate,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    try:
        new_org = Organization(
            organization_type=organization_data.organization_type,
            company_name=organization_data.company_name,
            registration_number=organization_data.registration_number,
            gst_number=organization_data.gst_number,
            contact_number=organization_data.contact_number,
            offical_email=organization_data.offical_email,
            country=organization_data.country,
            state=organization_data.state,
            city=organization_data.city,
            is_active=organization_data.is_active,
        )
        db.add(new_org)
        db.commit()
        db.refresh(new_org)
        return new_org
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/organization/{organization_id}", response_model=OrganizationResponse)
def get_organization(organization_id: int, db: Session = Depends(get_db)):
    organization = (
        db.query(Organization)
        .filter(Organization.organization_id == organization_id)
        .first()
    )
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    return organization


@router.get("/organizations", response_model=list[OrganizationResponse])
def get_organizations(db: Session = Depends(get_db)):
    organization = db.query(Organization).all()
    return organization


@router.put("/update_organization", response_model=OrganizationResponse)
def update_organization(
    organization_data: OrganizationUpdate,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    organization = (
        db.query(Organization)
        .filter(Organization.organization_id == organization_data.organization_id)
        .first()
    )
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    organization.organization_type = organization_data.organization_type
    organization.company_name = organization_data.company_name
    organization.registration_number = organization_data.registration_number
    organization.gst_number = organization_data.gst_number
    organization.contact_number = organization_data.contact_number
    organization.offical_email = organization_data.offical_email
    organization.country = organization_data.country
    organization.state = organization_data.state
    organization.city = organization_data.city
    organization.join_date = organization_data.join_date
    organization.is_active = organization_data.is_active

    db.commit()
    db.refresh(organization)
    return organization


@router.put(
    "/deactivate_organization/{organization_id}", response_model=OrganizationResponse
)
def deactivate_organization(
    organization_id: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    organization = (
        db.query(Organization)
        .filter(Organization.organization_id == organization_id)
        .first()
    )
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    organization.is_active = not organization.is_active

    db.commit()
    db.refresh(organization)
    return organization


@router.delete("/delete_user/{organization_id}")
def delete_organization(
    organization_id: int,
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    organization = (
        db.query(Organization)
        .filter(Organization.organization_id == organization_id)
        .first()
    )
    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    db.delete(organization)
    db.commit()

    return {"success": True, "message": "Organization deleted successfully"}
