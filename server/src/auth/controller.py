from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from src.database.db import get_db
from src.auth.models import LoginRequest, SignupRequest
from src.auth.service import login_user, signup_user
from pydantic import BaseModel
import uuid
from src.utils.email import send_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


class ResetPasswordRequest(BaseModel):
    email: str


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    result = login_user(data, db)
    if result:
        return result
    raise HTTPException(status_code=401, detail="Invalid credentials")

<<<<<<< ours

@router.post("/signup", status_code=201)
def signup(data: SignupRequest):
    return signup_user(data)
=======
@router.post("/demo-login")
def demo_login(db: Session = Depends(get_db)):
    from src.database.models import User, Contract, Obligation, Renewal
    from datetime import date, timedelta
    
    # Create or retrieve Demo User
    demo_email = "demo@contractiq.com"
    demo_user = db.query(User).filter(User.email == demo_email).first()
    if not demo_user:
        demo_user = User(
            user_id=f"USR-{uuid.uuid4().hex[:6].upper()}",
            name="Demo User",
            email=demo_email,
            role="Admin",
            status="Active",
            lastLogin="Just now"
        )
        db.add(demo_user)
        db.commit()
        db.refresh(demo_user)

    # Clean existing data for demo environment reset
    db.query(Renewal).delete()
    db.query(Obligation).delete()
    db.query(Contract).delete()

    # Insert 6 realistic mock contracts
    base_date = date.today()
    contracts = [
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Acme Corp", type="MSA", status="Active", value=150000.00, owner="Demo User", date=base_date - timedelta(days=30)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Globex Inc", type="NDA", status="Active", value=0.00, owner="Demo User", date=base_date - timedelta(days=15)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Initech", type="SOW", status="Draft", value=75000.00, owner="Demo User", date=base_date - timedelta(days=5)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Soylent Corp", type="Vendor Agreement", status="Pending Signature", value=45000.00, owner="Demo User", date=base_date - timedelta(days=2)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Umbrella Corp", type="MSA", status="Expired", value=200000.00, owner="Demo User", date=base_date - timedelta(days=400)),
        Contract(contract_id=f"CTR-{uuid.uuid4().hex[:6].upper()}", vendor="Wayne Enterprises", type="Partnership", status="Active", value=500000.00, owner="Demo User", date=base_date - timedelta(days=100)),
    ]
    db.add_all(contracts)
    db.commit()
    
    # Add obligations
    obligations = [
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Quarterly True-up Report", dueDate=base_date + timedelta(days=15), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[0].id, description="Annual Security Audit", dueDate=base_date + timedelta(days=90), status="Pending", priority="Medium"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[2].id, description="Deliverable 1 Approval", dueDate=base_date + timedelta(days=5), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[3].id, description="First Payment Milestone", dueDate=base_date + timedelta(days=30), status="Pending", priority="High"),
        Obligation(obligation_id=f"OBL-{uuid.uuid4().hex[:6].upper()}", contract_id=contracts[5].id, description="Joint Marketing Plan", dueDate=base_date + timedelta(days=45), status="Pending", priority="Low"),
    ]
    db.add_all(obligations)
    db.commit()

    return {
        "token": "demo-jwt-token-99999", 
        "user": {"email": demo_user.email, "name": demo_user.name},
        "message": "Demo environment provisioned successfully"
    }

@router.post("/register", status_code=201)
def register(data: SignupRequest, db: Session = Depends(get_db)):
    if data.password != data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    return signup_user(data, db)

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully", "status": "success"}
>>>>>>> theirs


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    reset_token = str(uuid.uuid4())
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
<<<<<<< ours

    success, extra = send_reset_email(data.email, reset_link)

    if success:
        if extra:
            return {
                "message": "Email sent! (Test Mode)",
                "preview_url": extra,
            }
        return {"message": "Password reset link sent to your email."}

    raise HTTPException(
        status_code=500,
        detail="Failed to send email."
    )
=======
    
    try:
        success, extra = send_reset_email(data.email, reset_link)
        if success:
            if extra:
                return {"message": "Email sent! (Test Mode)", "preview_url": extra, "reset_link": reset_link}
            return {"message": "Password reset link sent to your email.", "reset_link": reset_link}
    except Exception as e:
        # If email fails (e.g. no internet or smtp), just return the link anyway for demo purposes
        pass

    return {"message": "Password reset link generated (mocked).", "reset_link": reset_link}
>>>>>>> theirs
