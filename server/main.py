from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import router
from config import settings
import models  # ensure models are registered

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ContractIQ — Renewal Management Service",
    description="FastAPI microservice for Contract Renewal Tracking, Expiry Monitoring, Approval Workflows, and Reminder Scheduling.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200", "http://localhost:3000", settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "ContractIQ Renewal Management",
        "status": "operational",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
