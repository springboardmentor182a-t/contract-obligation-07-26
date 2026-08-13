from collections.abc import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from src.auth.jwt import ALGORITHM, SECRET_KEY
from src.database.core import get_db
from src.database.models import User


ADMINISTRATOR = "Administrator"
LEGAL_MANAGER = "Legal Manager"
COMPLIANCE_OFFICER = "Compliance Officer"
CONTRACT_MANAGER = "Contract Manager"
DEPARTMENT_HEAD = "Department Head"
EMPLOYEE = "Employee"

ALL_ROLES = (
    ADMINISTRATOR,
    LEGAL_MANAGER,
    COMPLIANCE_OFFICER,
    CONTRACT_MANAGER,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)
CONTRACT_ROLES = (
    LEGAL_MANAGER,
    COMPLIANCE_OFFICER,
    CONTRACT_MANAGER,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)
OBLIGATION_ROLES = CONTRACT_ROLES
RENEWAL_ROLES = CONTRACT_ROLES
COMPLIANCE_ROLES = (
    LEGAL_MANAGER,
    COMPLIANCE_OFFICER,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)
DASHBOARD_ROLES = (
    LEGAL_MANAGER,
    COMPLIANCE_OFFICER,
    CONTRACT_MANAGER,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)
NOTIFICATION_ROLES = ALL_ROLES
QUICK_ACTION_ROLES = (
    LEGAL_MANAGER,
    COMPLIANCE_OFFICER,
    CONTRACT_MANAGER,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)
AUDIT_ROLES = (
    ADMINISTRATOR,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)
USER_MANAGEMENT_ROLES = (
    ADMINISTRATOR,
    LEGAL_MANAGER,
    DEPARTMENT_HEAD,
    EMPLOYEE,
)

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login",
    auto_error=False,
)


def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_error

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise credentials_error
        user_id = int(payload.get("sub", 0))
        token_role = str(payload.get("role", ""))
    except (JWTError, TypeError, ValueError):
        raise credentials_error

    if user_id <= 0 or not token_role:
        raise credentials_error

    user = db.query(User).filter(User.id == user_id).first()
    if user is None or not user.is_active:
        raise credentials_error

    database_role = user.role or ""
    if not database_role or token_role != database_role:
        raise credentials_error

    return user


def require_roles(*allowed_roles: str) -> Callable:
    allowed = frozenset(allowed_roles)

    def role_dependency(
        current_user: User = Depends(get_current_user),
    ) -> User:
        if current_user.role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )
        return current_user

    return role_dependency
