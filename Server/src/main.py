import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from database.core import create_tables, SessionLocal
from auth import controller
from users import controller as user_controller
from notifications import controller as notification_controller
from audit_logs import controller as audit_logs_controller
from renewals import controller as renewals_controller

# Import entities so tables are created
import entities.renewal  # noqa: F401
import entities.compliance  # noqa: F401
from database.seed import seed_db
from entities.compliance import Compliance
from api import router

create_tables()

app = FastAPI(
    title="Choose your Own Adventure Game API",
    description="api to generate cool stoties",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE
    allow_headers=["*"],
)

# Auto-seed compliance records if database is empty
db = SessionLocal()
try:
    if db.query(Compliance).count() == 0:
        print("No compliance records found. Auto-seeding...")
        db.close()
        seed_db()
    else:
        db.close()
except Exception as e:
    print("Auto-seed verification failed:", e)
    db.close()

app.include_router(router, prefix=settings.API_PREFIX)
app.include_router(renewals_controller.router, prefix=settings.API_PREFIX)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
