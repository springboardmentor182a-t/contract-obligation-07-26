from pydantic import BaseModel


class SettingsUpdate(BaseModel):
    email_alerts: bool
    push_notifications: bool
    contract_expiry: bool
    weekly_reports: bool

    theme: str
    compact_mode: bool
    timezone: str
