from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from jose import JWTError, jwt as jose_jwt
from fastapi.security import OAuth2PasswordBearer

from src.auth.jwt import SECRET_KEY, ALGORITHM
from src.audit.service import create_audit_log
from src.database.core import get_db
from src.database.models import UserSetting, ApiKey

router = APIRouter(prefix="/settings", tags=["Settings"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def _get_user_id(token: Optional[str]) -> int:
    if token:
        try:
            payload = jose_jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            uid = int(payload.get("sub", 0))
            if uid:
                return uid
        except (JWTError, ValueError):
            pass
    return 1


class SettingsUpdate(BaseModel):
    org_name: Optional[str] = None
    currency: Optional[str] = None
    date_format: Optional[str] = None
    email_notif: Optional[bool] = None
    slack_notif: Optional[bool] = None
    renewal_alerts: Optional[bool] = None
    two_factor: Optional[bool] = None
    sso: Optional[bool] = None
    sms_notif: Optional[bool] = None


class SettingsResponse(BaseModel):
    user_id: int
    org_name: str
    currency: str
    date_format: str
    email_notif: bool
    slack_notif: bool
    renewal_alerts: bool
    two_factor: bool
    sso: bool
    sms_notif: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)


class ApiKeyCreate(BaseModel):
    name: str


class ApiKeyResponse(BaseModel):
    id: int
    name: str
    key: str
    created: str


class GatewayUpdate(BaseModel):
    emailNotif: bool
    smsNotif: bool
    renewalAlerts: bool


class InvoiceResponse(BaseModel):
    id: int
    invoice_no: str
    date: str
    amount: str
    status: str


@router.get("", response_model=SettingsResponse)
def get_settings(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    settings = db.execute(
        select(UserSetting).where(UserSetting.user_id == user_id)
    ).scalars().first()

    if not settings:
        settings = UserSetting(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return settings


@router.patch("", response_model=SettingsResponse)
def update_settings(
    payload: SettingsUpdate,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    settings = db.execute(
        select(UserSetting).where(UserSetting.user_id == user_id)
    ).scalars().first()

    if not settings:
        settings = UserSetting(user_id=user_id)
        db.add(settings)

    if payload.org_name is not None:
        settings.org_name = payload.org_name
    if payload.currency is not None:
        settings.currency = payload.currency
    if payload.date_format is not None:
        settings.date_format = payload.date_format
    if payload.email_notif is not None:
        settings.email_notif = payload.email_notif
    if payload.slack_notif is not None:
        settings.slack_notif = payload.slack_notif
    if payload.renewal_alerts is not None:
        settings.renewal_alerts = payload.renewal_alerts
    if payload.two_factor is not None:
        settings.two_factor = payload.two_factor
    if payload.sso is not None:
        settings.sso = payload.sso

    db.add(settings)
    db.commit()
    db.refresh(settings)

    changed_fields = sorted(
        field
        for field, value in payload.model_dump().items()
        if value is not None
    )

    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="UPDATE",
        action="Settings Updated",
        module="Settings",
        description=(
            f"Updated settings for user ID: {settings.user_id} "
            f"(fields: {', '.join(changed_fields) or 'none'})"
        ),
    )

    return settings


@router.post("/notifications/gateways")
def update_gateways(
    payload: GatewayUpdate,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    settings = db.execute(
        select(UserSetting).where(UserSetting.user_id == user_id)
    ).scalars().first()

    if not settings:
        settings = UserSetting(user_id=user_id)
        db.add(settings)

    settings.email_notif = payload.emailNotif
    settings.renewal_alerts = payload.renewalAlerts

    db.add(settings)
    db.commit()
    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="UPDATE",
        action="Notification Gateways Updated",
        module="Settings",
        description=(
            f"Updated notification gateways for user ID: {settings.user_id} "
            f"(email: {payload.emailNotif}, "
            f"renewal alerts: {payload.renewalAlerts})"
        ),
    )

    return {
        "status": "success",
        "message": "Gateways configured successfully",
    }


@router.get("/security/apikeys", response_model=List[ApiKeyResponse])
def list_api_keys(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    keys = db.execute(
        select(ApiKey).where(ApiKey.user_id == user_id)
    ).scalars().all()

    return [
        ApiKeyResponse(
            id=k.id,
            name=k.name,
            key=k.key,
            created=k.created_at.strftime("%Y-%m-%d") if k.created_at else datetime.now().strftime("%Y-%m-%d"),
        )
        for k in keys
    ]


@router.post("/security/apikeys", response_model=ApiKeyResponse)
def create_api_key(
    payload: ApiKeyCreate,
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    user_id = _get_user_id(token)
    import secrets
    raw_key = "ct_live_" + secrets.token_hex(16)

    new_key = ApiKey(
        user_id=user_id,
        name=payload.name,
        key="ct_live_..." + raw_key[-4:],
    )
    db.add(new_key)
    db.commit()
    db.refresh(new_key)

    create_audit_log(
        db=db,
        user_id=user_id,
        event_type="CREATE",
        action="API Key Created",
        module="Settings",
        description=(
            f"Created API key: {new_key.name} "
            f"(ID: {new_key.id}, user ID: {new_key.user_id})"
        ),
    )

    return ApiKeyResponse(
        id=new_key.id,
        name=new_key.name,
        key=new_key.key,
        created=datetime.now().strftime("%Y-%m-%d"),
    )
