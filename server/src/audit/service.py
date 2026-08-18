from typing import Optional

from sqlalchemy.orm import Session

from src.database.models import AuditLogModel


def create_audit_log(
    db: Session,
    user_id: Optional[int],
    event_type: str,
    action: str,
    module: str,
    description: Optional[str] = None,
    ip_address: Optional[str] = None,
) -> AuditLogModel:
    audit_log = AuditLogModel(
        user_id=user_id,
        event_type=event_type,
        action=action,
        module=module,
        description=description,
        ip_address=ip_address,
    )

    db.add(audit_log)
    db.commit()
    db.refresh(audit_log)

    return audit_log