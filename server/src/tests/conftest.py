import pytest
from fastapi.testclient import TestClient

from src.database.core import get_db
from src.main import app


class FakeDatabaseSession:
    """
    A lightweight fake database session.

    Authentication service methods are mocked in the tests,
    so this object does not connect to the real Supabase database.
    """

    pass


def override_get_db():
    """
    Replace the real database dependency during automated tests.
    """
    yield FakeDatabaseSession()


@pytest.fixture
def client() -> TestClient:
    """
    Provide a FastAPI test client without using the real database.
    """
    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()