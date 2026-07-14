from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.contracts.controller import router
from .api import router as api_router

app = FastAPI(
    title="ContractIQ API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your contract routes
app.include_router(router)

# Existing API routes from main-group-D
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def home():
    return {
        "message": "Contract Backend Running Successfully"
    }