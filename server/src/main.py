from fastapi import FastAPI

from src.api import api_router
from src.logging import configure_logging
from src.rate_limiter import init_rate_limiter
from src.database.core import engine
from src.database.models import Base

Base.metadata.create_all(bind=engine)

configure_logging()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Server")

# Configure CORS to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],  # Must be specific when allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

from starlette.middleware.sessions import SessionMiddleware

app.add_middleware(
    SessionMiddleware,
    secret_key="some-secret-key"
)

app = init_rate_limiter(app)
app.include_router(api_router, prefix="/api")

from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"Global Exception: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)}
    )


@app.get("/")
def root():
    return {"status": "ok"}
