from pathlib import Path
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Setting(BaseSettings):
    DATABASE_URL: str

    API_PREFIX: str = "/api"
    DEBUG: bool = False

    ALLOWED_ORIGINS: List[str] = []

    # JWT
    SECRET_KEY: str = "J@ISHREER@M@12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

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

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        if isinstance(v, str):
            v_stripped = v.strip()
            if v_stripped.startswith("[") and v_stripped.endswith("]"):
                import json
                try:
                    return json.loads(v_stripped)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",")]
        return v

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        extra="ignore"
    )

settings = Setting()
