from fastapi import Request
from fastapi.responses import JSONResponse

class CustomException(Exception):
    def __init__(self, name: str, message: str, status_code: int = 400):
        self.name = name
        self.message = message
        self.status_code = status_code

async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.name, "message": exc.message},
    )