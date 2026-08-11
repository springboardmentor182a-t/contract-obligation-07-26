from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Setting(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = False

    ALLOWED_ORIGINS: List[str] = []

    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgre26@localhost:5432/contract_iq"

    # JWT
    SECRET_KEY: str = "J@ISHREER@M@12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Send Mail
    EMAIL_BACKEND: str = ""
    EMAIL_HOST: str = ""
    EMAIL_USE_TLS: bool = True
    EMAIL_PORT: int = 587
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v):
        import json
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip().strip('"').strip("'") for i in v.split(",")]
        return v

    model_config = SettingsConfigDict(
        env_file=(".env", "src/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Setting()
