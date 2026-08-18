from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from datetime import date

from database import get_db
from models import User, UserRole, Contract, Renewal, RenewalStatus, RenewalHistory
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


@router.post("/auth/demo-login", tags=["Authentication"])
def demo_login(db: Session = Depends(get_db)):
    """Auto-login as legal manager for demo purposes."""
    user = db.query(User).filter(User.email == "legal.manager@contractiq.com").first()
    if not user:
        # fallback: first active user
        user = db.query(User).filter(User.is_active == True).first()
    if not user:
        raise HTTPException(status_code=404, detail="No demo user found. Run seed_data.py first.")
    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    return {
        "token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.full_name,
            "email": user.email,
            "role": user.role.value,
            "department": user.department
        }
    }


@router.get("/auth/me", response_model=UserOut, tags=["Authentication"])
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


# ─── Dashboard Stats ─────────────────────────────────────────────────────────
@router.get("/dashboard/stats", tags=["Dashboard"])
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Aggregate stats for the home dashboard."""
    services.check_and_mark_expired(db)

    total_users = db.query(func.count(User.id)).filter(User.is_active == True).scalar() or 0
    total_contracts = db.query(func.count(Contract.id)).scalar() or 0
    active_contracts = db.query(func.count(Contract.id)).filter(Contract.status == "active").scalar() or 0
    expired_contracts = db.query(func.count(Contract.id)).filter(Contract.status == "expired").scalar() or 0

    renewal_stats = services.get_stats(db)

    return {
        "total_users": total_users,
        "total_contracts": total_contracts,
        "active_contracts": active_contracts,
        "expired_contracts": expired_contracts,
        "pending_approvals": renewal_stats.upcoming + renewal_stats.in_progress,
        "renewals_due_soon": renewal_stats.expiring_in_30_days,
        "total_renewal_value": renewal_stats.total_renewal_value,
        "renewals": {
            "total": renewal_stats.total,
            "upcoming": renewal_stats.upcoming,
            "in_progress": renewal_stats.in_progress,
            "renewed": renewal_stats.renewed,
            "expired": renewal_stats.expired,
            "cancelled": renewal_stats.cancelled,
            "expiring_in_30_days": renewal_stats.expiring_in_30_days,
            "expiring_in_60_days": renewal_stats.expiring_in_60_days,
            "expiring_in_90_days": renewal_stats.expiring_in_90_days,
        }
    }


# ─── User Routes ─────────────────────────────────────────────────────────────
@router.get("/users", response_model=List[UserOut], tags=["Users"])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(User).filter(User.is_active == True).all()


@router.delete("/users/{user_id}", tags=["Users"])
def deactivate_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot deactivate yourself")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.is_active = False
    db.commit()
    return {"message": f"User {user.full_name} deactivated"}


@router.put("/users/{user_id}", response_model=UserOut, tags=["Users"])
def update_user(
    user_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if "name" in data:
        user.full_name = data["name"]
    if "email" in data:
        user.email = data["email"]
    if "department" in data:
        user.department = data["department"]
    db.commit()
    db.refresh(user)
    return user


@router.post("/users", response_model=UserOut, status_code=201, tags=["Users"])
def create_user(data: UserCreate, db: Session = Depends(get_db),
                current_user: User = Depends(get_current_user)):
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


# ─── Contract Routes ──────────────────────────────────────────────────────────
@router.get("/contracts", tags=["Contracts"])
def list_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contracts = db.query(Contract).all()
    return [
        {
            "id": c.id,
            "contract_number": c.contract_number,
            "title": c.title,
            "vendor_name": c.vendor_name,
            "category": c.category,
            "value": c.value,
            "currency": c.currency,
            "start_date": str(c.start_date),
            "end_date": str(c.end_date),
            "status": c.status
        }
        for c in contracts
    ]


# ─── Renewal Routes ─────────────────────────────────────────────────────────────
@router.get("/renewals/stats", response_model=RenewalStats, tags=["Renewals"])
def get_renewal_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
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


@router.get("/history", response_model=List[RenewalHistoryOut], tags=["System"])
def get_global_history(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_renewal_access)
):
    return db.query(RenewalHistory).order_by(RenewalHistory.created_at.desc()).limit(limit).all()


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
