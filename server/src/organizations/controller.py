from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import User
from src.auth.dependencies import get_current_user, require_roles
from src.organizations.schemas import OrganizationCreate, OrganizationUpdate, OrganizationResponse, UserAssignRequest
from src.organizations.service import OrganizationService

router = APIRouter(prefix="/organizations", tags=["Organizations"])

@router.get("/", response_model=list[OrganizationResponse])
def list_organizations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return OrganizationService.get_organizations(db, current_user)

@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
def create_organization(
    data: OrganizationCreate,
    db: Session = Depends(get_db),
):
    return OrganizationService.create_organization(db, data)

@router.get("/{org_id}", response_model=OrganizationResponse)
def get_organization(
    org_id: int,
    db: Session = Depends(get_db),
):
    return OrganizationService.get_organization(db, org_id)

@router.put("/{org_id}", response_model=OrganizationResponse)
def update_organization(
    org_id: int,
    data: OrganizationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return OrganizationService.update_organization(db, org_id, data, current_user)

@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    org_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("Administrator"))
):
    OrganizationService.delete_organization(db, org_id, current_user)

@router.post("/{org_id}/users")
def assign_user(
    org_id: int,
    req: UserAssignRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return OrganizationService.assign_user(db, org_id, req.user_id, current_user)
