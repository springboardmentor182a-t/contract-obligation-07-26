from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
import traceback

from src.api import api_router
from src.logger_config import configure_logging
from src.rate_limiter import init_rate_limiter
from src.database.core import engine
from src.database.models import Base


# Configure logging
configure_logging()


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(title="Server")


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Configure session middleware
app.add_middleware(
    SessionMiddleware,
    secret_key="some-secret-key",
)


# Configure rate limiter
app = init_rate_limiter(app)


# Include API routes
app.include_router(api_router, prefix="/api")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"Global Exception: {exc}")
    traceback.print_exc()

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "error": str(exc),
        },
    )


# Root endpoint
@app.get("/")
def root():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )