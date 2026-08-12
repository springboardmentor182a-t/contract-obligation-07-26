import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

from dotenv import load_dotenv
from jose import jwt

# Load server/.env relative to this file (__file__ -> server/src/auth/jwt.py)
SERVER_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = SERVER_DIR / ".env"
load_dotenv(ENV_FILE)

# Provide sensible defaults for development; in production ensure env vars are set
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)
)

# In production, ensure a real secret is provided
if os.getenv("ENV", "development") == "production" and SECRET_KEY == "dev-secret":
    raise RuntimeError(
        "SECRET_KEY must be set in server/.env or environment when running in production"
    )


def create_access_token(data: dict):
    to_encode = data.copy()

    expire = datetime.now(
        timezone.utc
    ) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update(
        {
            "exp": expire,
            "type": "access",
        }
    )

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
