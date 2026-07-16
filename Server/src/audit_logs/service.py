from sqlalchemy.orm import Session
from entities.audit_logs import AuditLog


def create_audit_log(
    db: Session,
    user_id: int,
    user_name: str,
    action: str,
    status: str,
    module: str,
    description: str,
):
    log = AuditLog(
        user_id=user_id,
        user_name=user_name,
        action=action,
        status=status,
        module=module,
        description=description,
    )

    db.add(log)
    db.commit()
