import pytest
from unittest.mock import MagicMock, patch
from fastapi import FastAPI
from fastapi.testclient import TestClient

from src.auth.controller import router
from src.database.core import get_db
from src.auth.service import verify_password

# -----------------------------
# Test App
# -----------------------------
app = FastAPI()
app.include_router(router)


# -----------------------------
# Fake DB Dependency
# -----------------------------
def override_get_db():
    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None
    yield db


from src.users.service import admin_required

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[admin_required] = lambda: MagicMock(role="Admin")

client = TestClient(app)


# ==========================================================
# REGISTER USER SUCCESS
# ==========================================================
@patch("src.audit_logs.service.create_audit_log")
@patch("src.auth.controller.hash_password")
def test_register_user_success(mock_hash_password, mock_audit):

    mock_hash_password.return_value = "hashed_password"

    response = client.post(
        "/auth/register",
        json={
            "role": "Admin",
            "full_name": "Rituraj",
            "email": "rituraj@gmail.com",
            "phone": "9876543210",
            "password": "123456",
            "employee_id": "EMP001",
            "organization_id": 1,
            "company_name": "ABC",
            "department": "IT",
            "designation": "Developer",
            "location": "Delhi",
        },
    )

    assert response.status_code in [200, 201]


# ==========================================================
# REGISTER USER DATABASE ERROR
# ==========================================================
@patch("src.auth.controller.hash_password")
def test_register_user_db_error(mock_hash):

    mock_hash.return_value = "hashed"

    db = MagicMock()
    db.query.return_value.filter.return_value.first.return_value = None

    db.commit.side_effect = Exception("Database Error")

    app.dependency_overrides[get_db] = lambda: db

    response = client.post(
        "/auth/register",
        json={
            "role": "Admin",
            "full_name": "Rituraj",
            "email": "rituraj@gmail.com",
            "phone": "9876543210",
            "password": "123456",
            "employee_id": "EMP001",
            "organization_id": 1,
            "company_name": "ABC",
            "department": "IT",
            "designation": "Developer",
            "location": "Delhi",
        },
    )

    assert response.status_code == 500


# ==========================================================
# GET USER SUCCESS
# ==========================================================
def test_get_user_success():

    db = MagicMock()

    fake_user = MagicMock()

    fake_user.user_id = 1
    fake_user.role = "Admin"
    fake_user.full_name = "Rituraj"
    fake_user.email = "rituraj@gmail.com"
    fake_user.phone = "9876543210"
    fake_user.employee_id = "EMP001"
    fake_user.company_name = "ABC"
    fake_user.department = "IT"
    fake_user.designation = "Developer"
    fake_user.location = "Delhi"

    db.query.return_value.filter.return_value.first.return_value = fake_user

    app.dependency_overrides[get_db] = lambda: db

    response = client.get("/auth/user/1")

    assert response.status_code == 200


# ==========================================================
# GET USER NOT FOUND
# ==========================================================
def test_get_user_not_found():

    db = MagicMock()

    db.query.return_value.filter.return_value.first.return_value = None

    app.dependency_overrides[get_db] = lambda: db

    response = client.get("/auth/user/100")

    assert response.status_code == 404
    assert response.json()["detail"] == "User not exist!!"


# ==========================================================
# LOGIN SUCCESS
# ==========================================================
@patch("src.auth.controller.create_access_token")
@patch("src.auth.controller.verify_password")
@patch("src.audit_logs.service.create_audit_log")
def test_login_success(
    mock_audit,
    mock_verify,
    mock_token,
):

    db = MagicMock()

    user = MagicMock()

    user.user_id = 1
    user.email = "rituraj@gmail.com"
    user.password = "hashed"
    user.role = "Admin"
    user.full_name = "Rituraj"

    db.query.return_value.filter.return_value.first.return_value = user

    app.dependency_overrides[get_db] = lambda: db

    mock_verify.return_value = True
    mock_token.return_value = "jwt_token"

    response = client.post(
        "/auth/login",
        json={"email": "rituraj@gmail.com", "password": "123456"},
    )

    assert response.status_code == 200

    assert response.json()["access_token"] == "jwt_token"


# ==========================================================
# LOGIN USER NOT FOUND
# ==========================================================
def test_login_user_not_found():

    db = MagicMock()

    db.query.return_value.filter.return_value.first.return_value = None

    app.dependency_overrides[get_db] = lambda: db

    response = client.post(
        "/auth/login",
        json={"email": "test@gmail.com", "password": "123456"},
    )

    assert response.status_code == 404

    assert response.json()["detail"] == "User not exist!!"


# ==========================================================
# LOGIN WRONG PASSWORD
# ==========================================================
@patch("src.auth.controller.verify_password")
@patch("src.audit_logs.service.create_audit_log")
def test_login_wrong_password(
    mock_audit,
    mock_verify,
):

    db = MagicMock()

    user = MagicMock()

    user.user_id = 1
    user.email = "rituraj@gmail.com"
    user.password = "hashed"
    user.full_name = "Rituraj"

    db.query.return_value.filter.return_value.first.return_value = user

    app.dependency_overrides[get_db] = lambda: db

    mock_verify.return_value = False

    response = client.post(
        "/auth/login",
        json={"email": "rituraj@gmail.com", "password": "wrongpassword"},
    )

    assert response.status_code == 404

    assert response.json()["detail"] == "Incorect password!!"
