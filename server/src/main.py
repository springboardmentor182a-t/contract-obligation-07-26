from fastapi import FastAPI

app = FastAPI(
    title="Contract Obligation Tracking Assistant",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "Backend is running successfully!"
    }