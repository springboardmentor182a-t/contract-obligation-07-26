from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.core import get_db
from entities.audit_logs import AuditLog
from entities.user import User
from users.service import admin_required

router = APIRouter(
    prefix="/audit_logs",
    tags=["audit_logs"],
)


@router.get("/audit_logs")
def get_admin_audit_logs(
    current_user: User = Depends(admin_required),
    db: Session = Depends(get_db),
):
    audit_logs = db.query(AuditLog).all()

    if not audit_logs:
        raise HTTPException(status_code=404, detail="No audit_logs found!")

    return audit_logs
