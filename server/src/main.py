from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.renewal_ai.controller import router as renewal_ai_router
from src.api import api_router
from src.contract_repository.controller import router as contract_repository_router
from src.ai_compliance_guardian.controller import (
    router as compliance_guardian_router,
)
from src.assurance import router as assurance_router
from src.insights.controller import router as insights_router
from src.database.core import initialize_database
from src.logging import configure_logging
from src.rate_limiter import init_rate_limiter

from src.logging import configure_logging
from src.rate_limiter import init_rate_limiter
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

configure_logging()

app = FastAPI(title="ContractIQ")

app = init_rate_limiter(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local Frontend
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",

        # Render Frontend
        "https://contract-obligation-frontend-group-c.onrender.com",
    ],
    allow_origin_regex=r"https://.*\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize database once when the application starts
@app.on_event("startup")
def startup():
    initialize_database()


# Main API
app.include_router(api_router)

# Contract Repository
app.include_router(
    contract_repository_router,
    prefix="/api",
)
app.include_router(
    compliance_guardian_router,
    prefix="/api",
)

app.include_router(
    renewal_ai_router,
    prefix="/api",
)
app.include_router(
    insights_router,
    prefix="/api",
)
app.include_router(
    assurance_router,
    prefix="/api",
)

@app.get("/")
def root():
    return {
        "status": "ok"
    }

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    with open("validation_error.log", "w") as f:
        f.write(f"Validation Error: {exc.errors()}\n")
        f.write(f"Body: {exc.body}\n")
    return JSONResponse(status_code=422, content={"detail": exc.errors(), "body": exc.body})

from sqlalchemy.exc import IntegrityError

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request, exc):
    import traceback
    with open("integrity_error.log", "w") as f:
        f.write(traceback.format_exc())
    return JSONResponse(
        status_code=400,
        content={"detail": "A record with this unique identifier already exists. Please check contract number or other unique fields."}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    with open("global_error.log", "w") as f:
        f.write(traceback.format_exc())
    return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})
