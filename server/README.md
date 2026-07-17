# Server

FastAPI backend. Run with:

```
pip install -r requirements.txt
uvicorn src.main:app --reload
```

Run tests with:

```
pytest
```

Environment variables
---------------------

The server expects certain environment variables to be set. Copy `server/.env.example` to `server/.env` for local development and update values as needed. At minimum, set:

- `DATABASE_URL` — SQLAlchemy database URL (e.g. `postgresql://user:pass@localhost:5432/dbname`).
- `SECRET_KEY` — secret used for signing tokens.

In CI the code will automatically fall back to an in-memory SQLite database if `DATABASE_URL` is not provided.
