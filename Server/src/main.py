import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from database.core import create_tables
from auth import controller
from users import controller as user_controller
from notifications import controller as notification_controller
from audit_logs import controller as audit_logs_controller
from renewals import controller as renewals_controller

# Import entities so tables are created
import entities.renewal  # noqa: F401
from api import router

create_tables()


# Auto-seed renewals when the table is empty
def _auto_seed_renewals():
    from database.core import SessionLocal
    from renewals.service import seed_renewals
    from entities.renewal import Renewal

    db = SessionLocal()
    try:
        if db.query(Renewal).count() == 0:
            seed_renewals(db)
            print("Auto-seeded renewal data.")
    finally:
        db.close()


_auto_seed_renewals()

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

app.include_router(router, prefix=settings.API_PREFIX)

app.include_router(renewals_controller.router, prefix=settings.API_PREFIX)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
