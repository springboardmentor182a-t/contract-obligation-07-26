from src.contract_repository.models import Contract
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
    Date,
)
from sqlalchemy.orm import relationship

from src.database.core import Base


class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

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

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    settings = relationship(
        "UserSetting",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    notifications = relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete-orphan",
    )


# Backwards-compatible alias for older imports
UserModel = User


class UserSetting(Base):
    __tablename__ = "user_settings"
    __table_args__ = {"schema": "public"}

    user_id = Column(
        Integer,
        ForeignKey(
            "public.users.id",
            ondelete="CASCADE",
        ),
        primary_key=True,
    )

    org_name = Column(String(255), default="Acme Corp")
    currency = Column(String(10), default="USD")
    date_format = Column(String(20), default="YYYY-MM-DD")
    email_notif = Column(Boolean, default=True)
    slack_notif = Column(Boolean, default=False)
    renewal_alerts = Column(Boolean, default=True)
    two_factor = Column(Boolean, default=True)
    sso = Column(Boolean, default=False)

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user = relationship(
        "User",
        back_populates="settings",
    )


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        # ForeignKey(
        #     "public.users.id",
        #     ondelete="CASCADE",
        # ),
        ForeignKey("public.users.id", ondelete="CASCADE"),
        nullable=False,
    )

    category = Column(String(100), nullable=False)
    urgency = Column(String(50), nullable=False, default="info")
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        back_populates="notifications",
    )


class ObligationModel(Base):
    __tablename__ = "obligations"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    title = Column(
        String(255),
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    contract_id = Column(
        Integer,
        ForeignKey("public.contracts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    owner_id = Column(
        Integer,
        ForeignKey(
            "public.users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    priority = Column(
        String(50),
        nullable=False,
        default="Medium",
        index=True,
    )

    status = Column(
        String(50),
        nullable=False,
        default="Pending",
        index=True,
    )

    due_date = Column(
        Date,
        nullable=False,
        index=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    contract = relationship(
        "Contract",
        backref="obligations",
    )

    owner = relationship(
        "User",
        backref="owned_obligations",
)
class UserInvitation(Base):
    __tablename__ = "user_invitations"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    role = Column(String(100), nullable=True)
    department = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    status = Column(String(50), nullable=False, default="Pending")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )


class ApiKey(Base):
    __tablename__ = "api_keys"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey(
            "public.users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    name = Column(String(255), nullable=False)
    key = Column(String(1024), nullable=False)
    revoked = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        backref="api_keys",
    )


class AnalyticsSnapshot(Base):
    __tablename__ = "analytics_snapshots"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    metric_key = Column(String(100), nullable=False)
    label = Column(String(255), nullable=False)
    value = Column(String(255), nullable=False)
    trend = Column(String(50), nullable=True)

    recorded_at = Column(
    DateTime(timezone=True),
    server_default=func.now(),
)


class MonthlyVolume(Base):
    __tablename__ = "monthly_volumes"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String(50), nullable=False)
    value = Column(Integer, nullable=False, default=0)
    sort_order = Column(Integer, nullable=False, default=0)


class QuickAction(Base):
    __tablename__ = "quick_actions"
    __table_args__ = {"schema": "public"}

    id = Column(String(100), primary_key=True)
    label = Column(String(255), nullable=False)
    description = Column(String(1024), nullable=True)
    icon = Column(String(255), nullable=True)
    color = Column(String(50), nullable=True)


class QuickActionLog(Base):
    __tablename__ = "quick_action_logs"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    quick_action_id = Column(
        String(100),
        ForeignKey(
            "public.quick_actions.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "public.users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    status = Column(String(50), nullable=False)

    executed_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    action = relationship(
        "QuickAction",
        backref="logs",
    )


class FAQ(Base):
    __tablename__ = "faqs"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String(1024), nullable=False)
    answer = Column(String(2048), nullable=False)
    sort_order = Column(Integer, nullable=False, default=0)


class SupportTicket(Base):
    __tablename__ = "support_tickets"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey(
            "public.users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    subject = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="Open")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship(
        "User",
        backref="support_tickets",
    )


class AuditLogModel(Base):
    __tablename__ = "audit_logs"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey(
            "public.users.id",
            ondelete="SET NULL",
        ),
        nullable=True,
        index=True,
    )

    event_type = Column(
        String(50),
        nullable=False,
        index=True,
    )

    action = Column(
        String(255),
        nullable=False,
        index=True,
    )

    module = Column(
        String(100),
        nullable=False,
        index=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    ip_address = Column(
        String(50),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    user = relationship(
    "User",
    backref="audit_logs",
)

class ComplianceControl(Base):
    __tablename__ = "compliance_controls"

    id = Column(String(100), primary_key=True)
    title = Column(String(255), nullable=False)
    status = Column(String(50), nullable=False, default="PASSED")
    weight = Column(Integer, nullable=False, default=100)
    last_verified = Column(DateTime(timezone=True), server_default=func.now())

    logs = relationship("ComplianceLog", back_populates="control", cascade="all, delete-orphan")


class ComplianceLog(Base):
    __tablename__ = "compliance_logs"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(String(100), ForeignKey("compliance_controls.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String(50), nullable=False, default="VERIFIED")
    message = Column(Text, nullable=False)

    control = relationship("ComplianceControl", back_populates="logs")

