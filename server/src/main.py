from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import api_router
from src.logger import configure_logging
from src.rate_limiter import init_rate_limiter

configure_logging()

from src.database.core import engine, Base
Base.metadata.create_all(bind=engine)

app = FastAPI(title="ContractIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app = init_rate_limiter(app)
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
