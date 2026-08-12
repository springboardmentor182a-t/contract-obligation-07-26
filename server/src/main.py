from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.database.core import Base, engine

from src.auth.controller import router as auth_router
from src.contracts.controller import router as contracts_router
from src.documents.controller import router as documents_router


# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ContractIQ API")


# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporary for testing
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register Routers
app.include_router(auth_router)
app.include_router(contracts_router)
app.include_router(documents_router)