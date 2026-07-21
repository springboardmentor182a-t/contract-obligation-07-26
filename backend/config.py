from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/contractiq"
    SECRET_KEY: str = "contractiq-super-secret-key-2024-renewal-module-jwt"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    REDIS_URL: str = "redis://localhost:6379/0"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    FRONTEND_URL: str = "http://localhost:4200"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"

settings = Settings()
