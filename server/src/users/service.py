from sqlalchemy.orm import Session
from src.users.models import User, UserCreate
from src.auth.service import AuthService

auth_service = AuthService()

class UserService:
    def get_user_by_email(self, db: Session, email: str):
        return db.query(User).filter(User.email == email).first()

    def create_user(self, db: Session, user: UserCreate):
        hashed_password = auth_service.get_password_hash(user.password)
        db_user = User(email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
