from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime
from src.database.core import get_db
from src.database.models import UserSetting, ApiKey

router = APIRouter(prefix="/settings", tags=["Settings"])

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

@router.get("", response_model=SettingsResponse)
async def get_settings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSetting).where(UserSetting.user_id == 1))
    settings = result.scalars().first()
    if not settings:
        settings = UserSetting(user_id=1)
        db.add(settings)
        await db.commit()
        await db.refresh(settings)
    return settings

@router.patch("", response_model=SettingsResponse)
async def update_settings(payload: SettingsUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserSetting).where(UserSetting.user_id == 1))
    settings = result.scalars().first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings record not found")

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
    await db.commit()
    await db.refresh(settings)
    return settings

# ── POST /api/settings/notifications/gateways ──
@router.post("/notifications/gateways")
async def update_gateways(payload: GatewayUpdate, db: AsyncSession = Depends(get_db)):
    # TODO: Connect API Endpoint here
    # Integrates with SendGrid API for emailNotif, and Twilio REST APIs for smsNotif
    result = await db.execute(select(UserSetting).where(UserSetting.user_id == 1))
    settings = result.scalars().first()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings record not found")
        
    settings.email_notif = payload.emailNotif
    settings.renewal_alerts = payload.renewalAlerts
    # Update Database setting for gateways
    db.add(settings)
    await db.commit()
    return {"status": "success", "message": "Gateways configured successfully"}

# ── POST /api/settings/security/apikeys ──
@router.post("/security/apikeys", response_model=ApiKeyResponse)
async def create_api_key(payload: ApiKeyCreate, db: AsyncSession = Depends(get_db)):
    # TODO: Connect API Endpoint here
    # Generates a hashed token and writes metadata to "api_keys" table
    import secrets
    raw_key = "ct_live_" + secrets.token_hex(16)
    
    new_key = ApiKey(
        user_id=1,
        name=payload.name,
        key="ct_live_..." + raw_key[-4:] # Return masked key to view, but write to DB
    )
    db.add(new_key)
    await db.commit()
    await db.refresh(new_key)
    
    return ApiKeyResponse(
        id=new_key.id,
        name=new_key.name,
        key=new_key.key,
        created=datetime.now().strftime("%Y-%m-%d")
    )
