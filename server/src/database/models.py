from sqlalchemy import Boolean, Column, Integer, String, Text, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship

from src.database.core import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    role = Column(String(100), nullable=False, default="User")
    organization = Column(String, nullable=True)
    department = Column(String(255), nullable=True)
    job_title = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    status = Column(String, default="Active")
    avatar_url = Column(String(1024), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    settings = relationship("UserSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

# Backwards-compatible alias for older imports
UserModel = User


class UserSetting(Base):
    __tablename__ = "user_settings"

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    org_name = Column(String(255), default="Acme Corp")
    currency = Column(String(10), default="USD")
    date_format = Column(String(20), default="YYYY-MM-DD")
    email_notif = Column(Boolean, default=True)
    slack_notif = Column(Boolean, default=False)
    renewal_alerts = Column(Boolean, default=True)
    two_factor = Column(Boolean, default=True)
    sso = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="settings")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    category = Column(String(100), nullable=False)
    urgency = Column(String(50), nullable=False, default="info")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")


class ContractModel(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    contract_type = Column(String, nullable=True)
    status = Column(String, nullable=True)


class UserInvitation(Base):
    __tablename__ = "user_invitations"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    role = Column(String(100), nullable=True)
    department = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    key = Column(String(1024), nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="api_keys")


class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    value = Column(String(255), nullable=False)
    trend = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class MonthlyVolume(Base):
    __tablename__ = "monthly_volumes"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(50), nullable=False)
    value = Column(Integer, nullable=False, default=0)
    sort_order = Column(Integer, nullable=False, default=0)


class QuickAction(Base):
    __tablename__ = "quick_actions"

    id = Column(String(100), primary_key=True)
    label = Column(String(255), nullable=False)
    description = Column(String(1024), nullable=True)
    icon = Column(String(255), nullable=True)
    color = Column(String(50), nullable=True)


class QuickActionLog(Base):
    __tablename__ = "quick_action_logs"

    id = Column(Integer, primary_key=True, index=True)
    quick_action_id = Column(String(100), ForeignKey("quick_actions.id", ondelete="SET NULL"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    status = Column(String(50), nullable=False)
    executed_at = Column(DateTime(timezone=True), server_default=func.now())

    action = relationship("QuickAction", backref="logs")


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(1024), nullable=False)
    answer = Column(String(2048), nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    subject = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="Open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="support_tickets")
