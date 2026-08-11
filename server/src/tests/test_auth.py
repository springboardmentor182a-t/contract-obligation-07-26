from fastapi import HTTPException, status
from fastapi.testclient import TestClient

from src.auth.controller import auth_service


def test_login_with_valid_credentials(
    client: TestClient,
    monkeypatch,
) -> None:
    """
    BE_AUTH_001:
    Verify that valid credentials return an access token.
    """

    def mock_successful_login(request, db):
        assert str(request.email) == "admin@example.com"
        assert request.password == "ValidPassword@123"
        assert request.role == "Administrator"

        return {
            "access_token": "mock-access-token",
            "token_type": "bearer",
            "role": "Administrator",
            "name": "Test Administrator",
        }

    monkeypatch.setattr(
        auth_service,
        "login",
        mock_successful_login,
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@example.com",
            "password": "ValidPassword@123",
            "role": "Administrator",
        },
    )

    assert response.status_code == 200

    response_data = response.json()

    assert response_data["access_token"] == "mock-access-token"
    assert response_data["token_type"] == "bearer"
    assert response_data["role"] == "Administrator"
    assert response_data["name"] == "Test Administrator"


def test_login_with_invalid_password(
    client: TestClient,
    monkeypatch,
) -> None:
    """
    BE_AUTH_002:
    Verify that an incorrect password returns 401 Unauthorized.
    """

    def mock_invalid_password(request, db):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    monkeypatch.setattr(
        auth_service,
        "login",
        mock_invalid_password,
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "admin@example.com",
            "password": "WrongPassword@123",
            "role": "Administrator",
        },
    )

    assert response.status_code == 401
    assert response.json() == {
        "detail": "Invalid email or password."
    }


def test_login_with_unregistered_email(
    client: TestClient,
    monkeypatch,
) -> None:
    """
    BE_AUTH_003:
    Verify that an unregistered email returns 401 Unauthorized.
    """

    def mock_unknown_user(request, db):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    monkeypatch.setattr(
        auth_service,
        "login",
        mock_unknown_user,
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "SomePassword@123",
            "role": "Administrator",
        },
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password."
