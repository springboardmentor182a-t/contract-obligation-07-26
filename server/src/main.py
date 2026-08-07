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
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Must be specific when allow_credentials=True
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

app = init_rate_limiter(app)
app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"status": "ok"}
