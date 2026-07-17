from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract
from sqlalchemy.sql import func

from entities.user import User
from entities.users_settings import UserSettings
from user_setting.models import SettingsUpdate
from database.core import get_db
from users.service import verify_token

router = APIRouter(prefix="/user_setting", tags=["User Setting"])


@router.get("/settings")
def get_settings(db: Session = Depends(get_db), payload: User = Depends(verify_token)):

    settings = (
        db.query(UserSettings)
        .filter(UserSettings.user_id == payload["user_id"])
        .first()
    )

    if not settings:

        settings = UserSettings(user_id=payload["user_id"])

        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "setting_id": settings.setting_id,
        "user_id": settings.user_id,
        "email_alerts": settings.email_alerts,
        "push_notifications": settings.push_notifications,
        "contract_expiry": settings.contract_expiry,
        "weekly_reports": settings.weekly_reports,
        "theme": settings.theme,
        "compact_mode": settings.compact_mode,
        "timezone": settings.timezone,
    }


@router.put("/settings")
def update_settings(
    data: SettingsUpdate,
    db: Session = Depends(get_db),
    payload: User = Depends(verify_token),
):

    settings = (
        db.query(UserSettings)
        .filter(UserSettings.user_id == payload["user_id"])
        .first()
    )

    if not settings:
        settings = UserSettings(user_id=payload["user_id"])
        db.add(settings)

    settings.email_alerts = data.email_alerts
    settings.push_notifications = data.push_notifications
    settings.contract_expiry = data.contract_expiry
    settings.weekly_reports = data.weekly_reports

    settings.theme = data.theme
    settings.compact_mode = data.compact_mode
    settings.timezone = data.timezone

    db.commit()
    db.refresh(settings)

    return {
        "message": "Settings updated successfully",
        "data": {
            "setting_id": settings.setting_id,
            "user_id": settings.user_id,
            "email_alerts": settings.email_alerts,
            "push_notifications": settings.push_notifications,
            "contract_expiry": settings.contract_expiry,
            "weekly_reports": settings.weekly_reports,
            "theme": settings.theme,
            "compact_mode": settings.compact_mode,
            "timezone": settings.timezone,
        },
    }
