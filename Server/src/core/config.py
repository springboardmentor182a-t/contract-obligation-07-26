from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_FILE = Path(__file__).resolve().parents[1] / ".env"


class Setting(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    API_PREFIX: str = "/api"
    DEBUG: bool = False

    # Email
    EMAIL_BACKEND: str = ""
    EMAIL_HOST: str = ""
    EMAIL_PORT: int = 587
    EMAIL_USE_TLS: bool = True
    EMAIL_HOST_USER: str = ""
    EMAIL_HOST_PASSWORD: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Setting()