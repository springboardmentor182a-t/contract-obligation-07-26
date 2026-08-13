from typing import List
import logging
import secrets

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select

from src.audit.service import create_audit_log
from src.auth.dependencies import USER_MANAGEMENT_ROLES, require_roles
from src.auth.security import hash_password
from src.database.core import get_db
from src.database.models import User, UserInvitation
from .schemas import (
    UserResponse,
    UserInviteRequest,
    UserInviteResponse,
    UserUpdateRequest,
)

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(require_roles(*USER_MANAGEMENT_ROLES))],
)
logger = logging.getLogger(__name__)


@router.get("", response_model=List[UserResponse])
def list_users(db=Depends(get_db)):
    result = db.execute(select(User))
    users = result.scalars().all()

    return [
        UserResponse(
            id=u.id,
            full_name=u.full_name,
            email=u.email,
            role=u.role,
            department=u.department or "",
            status=u.status,
            lastActive="Just now",
        )
        for u in users
    ]


@router.post("/invite", response_model=UserInviteResponse)
def invite_user(
    payload: UserInviteRequest,
    db=Depends(get_db),
):
    # Check if user already exists
    result = db.execute(
        select(User).where(User.email == payload.email)
    )
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )

    # Create invitation
    new_invitation = UserInvitation(
        email=payload.email,
        role=payload.role,
        department=payload.department,
        message=payload.message,
        status="Sent",
    )

    db.add(new_invitation)

    # Create user so it appears immediately in the User Table
    temp_password = secrets.token_hex(16)
    full_name = payload.full_name or payload.email.split("@")[0].capitalize()

    new_user = User(
        name=full_name,
        full_name=full_name,
        email=payload.email,
        password=hash_password(temp_password),
        role=payload.role,
        department=payload.department,
        status="Active",
        is_active=True,
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_invitation)
    db.refresh(new_user)

    create_audit_log(
        db=db,
        user_id=None,
        event_type="CREATE",
        action="User Invited",
        module="User Management",
        description=(
            f"Invited user: {new_user.full_name} "
            f"(ID: {new_user.id}, email: {new_user.email}, "
            f"role: {new_user.role})"
        ),
    )

    # Dispatch Invitation Email
    import os, smtplib
    from email.mime.text import MIMEText

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")

    email_subject = "You have been invited to ContractIQ"
    email_body = f"""Hello {full_name},

You have been invited to join the ContractIQ workspace as a {payload.role} ({payload.department or 'General'}).

Personal message: "{payload.message or 'Welcome to the team!'}"

Your temporary login details:
Email: {payload.email}
Temporary Password: {temp_password}

Access workspace: http://localhost:3000/login

Best regards,
ContractIQ Legal Operations Team
"""

    if smtp_host and smtp_user:
        try:
            msg = MIMEText(email_body)
            msg["Subject"] = email_subject
            msg["From"] = smtp_user
            msg["To"] = payload.email

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, [payload.email], msg.as_string())
            logger.info("Invitation email accepted by SMTP.")
        except Exception:
            logger.warning("Invitation email was not accepted by SMTP.")
    else:
        logger.warning("Invitation email was not sent because SMTP is unavailable.")

    return UserInviteResponse(
        id=new_invitation.id,
        email=new_invitation.email,
        role=new_invitation.role,
        department=new_invitation.department or "",
        status=new_invitation.status,
        invitedAt=new_invitation.created_at.isoformat(),
    )



@router.get("/invitations", response_model=List[UserInviteResponse])
def list_invitations(db=Depends(get_db)):
    result = db.execute(
        select(UserInvitation).order_by(UserInvitation.created_at.desc())
    )
    invitations = result.scalars().all()

    return [
        UserInviteResponse(
            id=inv.id,
            email=inv.email,
            role=inv.role,
            department=inv.department or "",
            status=inv.status,
            invitedAt=inv.created_at.isoformat(),
        )
        for inv in invitations
    ]


@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    payload: UserUpdateRequest,
    db=Depends(get_db),
):
    result = db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    previous_role = user.role
    previous_status = user.status

    user.full_name = payload.full_name
    user.name = payload.full_name
    user.email = payload.email
    user.role = payload.role
    user.department = payload.department
    user.status = payload.status

    db.commit()
    db.refresh(user)

    create_audit_log(
        db=db,
        user_id=None,
        event_type="UPDATE",
        action="User Updated",
        module="User Management",
        description=(
            f"Updated user: {user.full_name} "
            f"(ID: {user.id}, role: {previous_role} -> {user.role}, "
            f"status: {previous_status} -> {user.status})"
        ),
    )

    return UserResponse(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role,
        department=user.department or "",
        status=user.status,
        lastActive="Just now",
    )


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db=Depends(get_db),
):
    result = db.execute(
        select(User).where(User.id == user_id)
    )
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    deleted_user_id = user.id
    deleted_user_name = user.full_name
    deleted_user_email = user.email

    db.delete(user)
    db.commit()

    create_audit_log(
        db=db,
        user_id=None,
        event_type="DELETE",
        action="User Deleted",
        module="User Management",
        description=(
            f"Deleted user: {deleted_user_name} "
            f"(ID: {deleted_user_id}, email: {deleted_user_email})"
        ),
    )

    return {
        "message": "User deleted successfully"
    }
