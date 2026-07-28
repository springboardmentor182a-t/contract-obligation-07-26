from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[1] / ".env"


class Setting(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str

    API_PREFIX: str = "/api"
    DEBUG: bool = False

    ALLOWED_ORIGINS: List[str] = []

    DATABASE_URL: str = ""

    # JWT
    SECRET_KEY: str = ""
    ALGORITHM: str = ""
    ACCESS_TOKEN_EXPIRE_MINUTES: int = ""


    # Send Mail
    EMAIL_BACKEND: str = ""
    EMAIL_HOST: str = ""
    EMAIL_PORT: int = 587
    EMAIL_USE_TLS: bool = True
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""

    # Chatbot
    MODEL_PATH: str = "Qwen/Qwen2.5-1.5B-Instruct"
    VECTOR_DB: str = "./vector_db/contracts.index"
    CHUNKS_FILE: str = "./vector_db/chunks.pkl"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Setting()