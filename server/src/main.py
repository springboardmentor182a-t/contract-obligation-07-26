from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from src.database.core import get_db
from src.database.models import (
    Contract,
    Activity,
    Deadline,
    ComplianceItem,
    ReportHistory,
)
from src.users.controller import router as users_router
from src.contracts.controller import router as contracts_router

from pydantic import BaseModel
from datetime import date, datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    users_router,
    prefix="/users",
    tags=["Users"],
)

app.include_router(contracts_router)