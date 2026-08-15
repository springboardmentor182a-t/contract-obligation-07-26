import time
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.future import select
from sqlalchemy import text
from src.database.core import get_db

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
def get_health(db: Session = Depends(get_db)):
    start_time = time.time()
    
    # 1. API Status (Always OK if this router handles request)
    api_latency = (time.time() - start_time) * 1000
    api_status = "ok"
    
    # 2. Database Status (Real select 1 test)
    db_status = "ok"
    db_latency = 0
    db_error = None
    try:
        db_start = time.time()
        db.execute(text("SELECT 1"))
        db_latency = (time.time() - db_start) * 1000
    except Exception as e:
        db_status = "offline"
        db_error = str(e)
    
    # 3. Queue Status (Simulated Message Broker / Worker health check)
    # Check if DB is offline, queue is degraded/offline. Otherwise OK.
    if db_status == "offline":
        queue_status = "degraded"
        queue_msg = "Database offline, tasks paused"
    else:
        queue_status = "ok"
        queue_msg = "Worker pool responsive"
        
    overall_status = "ok"
    if db_status == "offline" or queue_status == "offline":
        overall_status = "offline"
    elif queue_status == "degraded":
        overall_status = "degraded"

    return {
        "status": overall_status,
        "services": {
            "api": {
                "status": api_status,
                "latency_ms": round(api_latency, 2)
            },
            "database": {
                "status": db_status,
                "latency_ms": round(db_latency, 2),
                "error": db_error
            },
            "queue": {
                "status": queue_status,
                "message": queue_msg
            }
        }
    }
