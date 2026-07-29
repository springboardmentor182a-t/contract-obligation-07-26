from fastapi import Request, HTTPException
import time

requests = {}

def rate_limit(request: Request):
    client_ip = request.client.host
    current_time = time.time()
    
    if client_ip in requests:
        if current_time - requests[client_ip] < 1.0: 
            raise HTTPException(status_code=429, detail="Too many requests")
    
    requests[client_ip] = current_time