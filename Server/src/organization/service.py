from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from entities.user import UserRole
from database.core import get_db
from entities.user import User
from auth.service import verify_token


def admin_required(
    payload: dict = Depends(verify_token),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == payload["sub"]).first()
    if not user:
        raise HTTPException(404, "User not exist!!")

    if user.role not in [
        UserRole.ADMIN,
        UserRole.LEGAL_MANAGER,
    ]:
        raise HTTPException(403, "Access denied!!")
    return user
