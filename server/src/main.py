# server/src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.compliance.controller import router as compliance_router
from src.database.core import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ContractIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(compliance_router)