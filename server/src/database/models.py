from sqlalchemy import Column, Integer, String, Boolean, Text, ForeignKey, DateTime, func
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from src.database.core import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    role = Column(String(100), nullable=False, default="User")
    department = Column(String(255))
    job_title = Column(String(255))
    phone = Column(String(50))
    bio = Column(Text)
    status = Column(String, default="Active")
    avatar_url = Column(String(1024))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    settings = relationship("UserSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    tickets = relationship("SupportTicket", back_populates="user", cascade="all, delete-orphan")
    action_logs = relationship("QuickActionLog", back_populates="user", cascade="all, delete-orphan")

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

class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    metric_key = Column(String(100), unique=True, nullable=False, index=True)
    label = Column(String(255), nullable=False)
    value = Column(String(100), nullable=False)
    trend = Column(String(50))
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

class MonthlyVolume(Base):
    __tablename__ = "monthly_volumes"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(20), nullable=False)
    value = Column(Integer, nullable=False)
    sort_order = Column(Integer, nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    subject = Column(String(255), nullable=False)
    severity = Column(String(100), nullable=False, default="Low")
    description = Column(Text, nullable=False)
    status = Column(String(50), default="Open")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="tickets")

class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(100), nullable=False)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    sort_order = Column(Integer, default=0)

class QuickAction(Base):
    __tablename__ = "quick_actions"

    id = Column(String(100), primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(100), nullable=False)
    color = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    logs = relationship("QuickActionLog", back_populates="action", cascade="all, delete-orphan")

class QuickActionLog(Base):
    __tablename__ = "quick_action_logs"

    id = Column(Integer, primary_key=True, index=True)
    quick_action_id = Column(String(100), ForeignKey("quick_actions.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    executed_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), default="Success")

    action = relationship("QuickAction", back_populates="logs")
    user = relationship("User", back_populates="action_logs")

class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(255), nullable=False)
    key = Column(String(512), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserInvitation(Base):
    __tablename__ = "user_invitations"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False)
    role = Column(String(100), nullable=False, default="Viewer")
    department = Column(String(255))
    message = Column(Text)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
