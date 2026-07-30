from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from database import get_db
from models import User, UserRole
from schemas import (
    UserCreate, UserLogin, Token, UserOut,
    RenewalCreate, RenewalUpdate, RenewalOut,
    RenewalApprovalAction, RenewalApprovalOut,
    RenewalReminderOut, RenewalHistoryOut,
    RenewalStats, CustomReminderCreate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, require_renewal_access
)
import services

router = APIRouter()


# ─── Auth Routes ────────────────────────────────────────────────────────────────
@router.post("/auth/register", response_model=UserOut, tags=["Authentication"])
def register(data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=data.email,
        full_name=data.full_name,
        hashed_password=get_password_hash(data.password),
        role=data.role,
        department=data.department
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/auth/login", response_model=Token, tags=["Authentication"])
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": user}


@router.get("/auth/me", response_model=UserOut, tags=["Authentication"])
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/users", response_model=List[UserOut], tags=["Users"])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    return db.query(User).filter(User.is_active == True).all()


# ─── Renewal Routes ─────────────────────────────────────────────────────────────
@router.get("/renewals/stats", response_model=RenewalStats, tags=["Renewals"])
def get_renewal_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    # Auto-mark expired
    services.check_and_mark_expired(db)
    return services.get_stats(db)


@router.post("/renewals", response_model=RenewalOut, status_code=201, tags=["Renewals"])
def create_renewal(
    data: RenewalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    try:
        return services.create_renewal(db, data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/renewals", response_model=List[RenewalOut], tags=["Renewals"])
def list_renewals(
    status_filter: Optional[str] = Query(None, alias="status"),
    priority_filter: Optional[str] = Query(None, alias="priority"),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    services.check_and_mark_expired(db)
    return services.get_renewals(db, status_filter, priority_filter, search, skip, limit)


@router.get("/renewals/{renewal_id}", response_model=RenewalOut, tags=["Renewals"])
def get_renewal(
    renewal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    renewal = services.get_renewal_by_id(db, renewal_id)
    if not renewal:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return renewal


@router.patch("/renewals/{renewal_id}", response_model=RenewalOut, tags=["Renewals"])
def update_renewal(
    renewal_id: int,
    data: RenewalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    try:
        return services.update_renewal(db, renewal_id, data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/renewals/{renewal_id}", tags=["Renewals"])
def cancel_renewal(
    renewal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    renewal = services.get_renewal_by_id(db, renewal_id)
    if not renewal:
        raise HTTPException(status_code=404, detail="Renewal not found")
    try:
        services.update_renewal(
            db, renewal_id,
            RenewalUpdate(status="cancelled", notes="Cancelled by user"),
            current_user
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {"message": "Renewal cancelled successfully"}


@router.post("/renewals/{renewal_id}/approve", response_model=RenewalApprovalOut, tags=["Renewals"])
def approve_renewal(
    renewal_id: int,
    data: RenewalApprovalAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    try:
        return services.process_approval(db, renewal_id, data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/renewals/{renewal_id}/complete", response_model=RenewalOut, tags=["Renewals"])
def complete_renewal(
    renewal_id: int,
    renewed_end_date: date = Query(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    try:
        return services.complete_renewal(db, renewal_id, renewed_end_date, current_user)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/renewals/{renewal_id}/history", response_model=List[RenewalHistoryOut], tags=["Renewals"])
def get_renewal_history(
    renewal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    renewal = services.get_renewal_by_id(db, renewal_id)
    if not renewal:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return renewal.history


@router.get("/renewals/{renewal_id}/reminders", response_model=List[RenewalReminderOut], tags=["Renewals"])
def get_renewal_reminders(
    renewal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    renewal = services.get_renewal_by_id(db, renewal_id)
    if not renewal:
        raise HTTPException(status_code=404, detail="Renewal not found")
    return renewal.reminders


@router.post("/reminders/custom", response_model=RenewalReminderOut, status_code=201, tags=["Reminders"])
def add_custom_reminder(
    data: CustomReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    try:
        return services.add_custom_reminder(db, data, current_user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/system/check-expired", tags=["System"])
def trigger_expiry_check(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    count = services.check_and_mark_expired(db)
    return {"message": f"Expiry check complete. {count} renewal(s) marked as expired."}
