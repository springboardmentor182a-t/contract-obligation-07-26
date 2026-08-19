from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError

from src.renewal_ai.controller import router as renewal_ai_router
from src.api import api_router
from src.contract_repository.controller import (
    router as contract_repository_router,
)
from src.ai_compliance_guardian.controller import (
    router as compliance_guardian_router,
)
from src.assurance import router as assurance_router
from src.insights.controller import router as insights_router
from src.database.core import initialize_database
from src.logging import configure_logging
from src.rate_limiter import init_rate_limiter


# ---------------------------------------------------------
# Logging configuration
# ---------------------------------------------------------

configure_logging()


# ---------------------------------------------------------
# Create FastAPI application
# ---------------------------------------------------------

app = FastAPI(
    title="ContractIQ"
)


# ---------------------------------------------------------
# Rate limiter
# ---------------------------------------------------------

app = init_rate_limiter(app)


# ---------------------------------------------------------
# CORS configuration
# ---------------------------------------------------------

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


# ---------------------------------------------------------
# Database initialization
# ---------------------------------------------------------

@app.on_event("startup")
def startup():
    initialize_database()


# ---------------------------------------------------------
# Main API router
# ---------------------------------------------------------

app.include_router(api_router)


# ---------------------------------------------------------
# Contract Repository
# ---------------------------------------------------------

app.include_router(
    contract_repository_router,
    prefix="/api",
)


# ---------------------------------------------------------
# AI Compliance Guardian
# ---------------------------------------------------------

app.include_router(
    compliance_guardian_router,
    prefix="/api",
)


# ---------------------------------------------------------
# Renewal AI
# ---------------------------------------------------------

app.include_router(
    renewal_ai_router,
    prefix="/api",
)


# ---------------------------------------------------------
# Insights
# ---------------------------------------------------------

app.include_router(
    insights_router,
    prefix="/api",
)


# ---------------------------------------------------------
# Assurance
# ---------------------------------------------------------

app.include_router(
    assurance_router,
    prefix="/api",
)


# ---------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "status": "ok"
    }


# ---------------------------------------------------------
# Request Validation Error Handler
# ---------------------------------------------------------
#
# Important:
# FastAPI OAuth2 sends login credentials as
# application/x-www-form-urlencoded data.
#
# When validation fails, exc.body can be bytes.
# bytes cannot be directly serialized to JSON.
# ---------------------------------------------------------

# @app.exception_handler(RequestValidationError)
# async def validation_exception_handler(request, exc):

#     # Save validation error details to log file
#     with open("validation_error.log", "w") as f:
#         f.write(
#             f"Validation Error: {exc.errors()}\n"
#         )
#         f.write(
#             f"Body: {exc.body}\n"
#         )

#     # Convert bytes to a JSON-serializable string
#     body = exc.body

#     if isinstance(body, bytes):
#         body = body.decode(
#             "utf-8",
#             errors="replace"
#         )

#     return JSONResponse(
#         status_code=422,
#         content={
#             "detail": exc.errors(),
#             "body": body,
#         },
#     )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):

    # Log the complete validation error
    with open("validation_error.log", "w") as f:
        f.write(f"Validation Error: {exc.errors()}\n")
        f.write(f"Body: {exc.body}\n")

    # Only return JSON-safe validation information.
    # Do not return exc.body directly because it may be
    # bytes, FormData, or another non-JSON-serializable object.
    errors = []

    for error in exc.errors():
        errors.append({
            "type": error.get("type"),
            "loc": error.get("loc"),
            "msg": error.get("msg"),
        })

    return JSONResponse(
        status_code=422,
        content={
            "detail": errors,
        },
    )
# ---------------------------------------------------------
# Database Integrity Error Handler
# ---------------------------------------------------------

@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request, exc):

    import traceback

    # Save complete error to log file
    with open("integrity_error.log", "w") as f:
        f.write(
            traceback.format_exc()
        )

    return JSONResponse(
        status_code=400,
        content={
            "detail": (
                "A record with this unique identifier "
                "already exists. Please check contract "
                "number or other unique fields."
            )
        },
    )


# ---------------------------------------------------------
# Global Exception Handler
# ---------------------------------------------------------

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    import traceback

    # Save complete error to log file
    with open("global_error.log", "w") as f:
        f.write(
            traceback.format_exc()
        )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error"
        },
    )