from fastapi import FastAPI
<<<<<<< HEAD

from src.api import api_router
from src.logging import configure_logging
from src.rate_limiter import init_rate_limiter

configure_logging()

app = FastAPI(title="Server")
app = init_rate_limiter(app)
app.include_router(api_router)


@app.get("/")
def root():
    return {"status": "ok"}
=======
from fastapi.middleware.cors import CORSMiddleware
from src.api import api_router

app = FastAPI(title="ContractIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
>>>>>>> e4b4e4e0c29f6c8156d879c7524be11fe270caa9
