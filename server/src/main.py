from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.renewal_ai.controller import router as renewal_ai_router
from src.api import api_router
from src.logging import configure_logging
from src.rate_limiter import init_rate_limiter
from src.contract_repository.controller import router as contract_repository_router
configure_logging()

app = FastAPI(title="ContractIQ")

app = init_rate_limiter(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "https://contract-obligation-frontend.onrender.com"
    ],
    allow_origin_regex=r"https://.*\.app\.github\.dev",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)
app.include_router(
    contract_repository_router,
    prefix="/api",
)
app.include_router(
    renewal_ai_router,
    prefix="/api",
)

@app.get("/")
def root():
    return {"status": "ok"}