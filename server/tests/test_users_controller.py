import pytest

from src.users import controller
from src.users.models import UserManagementCreate


def test_read_user_success(monkeypatch):
    expected_user = {
        "id": 1,
        "email": "test@example.com",
        "name": "Test User",
        "is_active": True,
    }

    monkeypatch.setattr(
        controller,
        "get_user_by_id",
        lambda user_id: expected_user,
    )

    result = controller.read_user(1)

    assert result == expected_user


def test_read_user_not_found(monkeypatch):
    monkeypatch.setattr(
        controller,
        "get_user_by_id",
        lambda user_id: None,
    )

    with pytest.raises(Exception) as exc_info:
        controller.read_user(999)

    assert exc_info.value.status_code == 404


def test_read_all_users(monkeypatch):
    expected_users = [
        {
            "id": 1,
            "email": "test@example.com",
            "name": "Test User",
            "department": "IT",
            "role": "Admin",
            "status": "Active",
            "is_active": True,
        }
    ]

    monkeypatch.setattr(
        controller,
        "get_all_users",
        lambda: expected_users,
    )

    result = controller.read_all_users()

    assert result == expected_users


def test_create_management_user(monkeypatch):
    user_data = UserManagementCreate(
        email="new@example.com",
        name="New User",
        department="IT",
        role="Admin",
        status="Active",
    )

    expected_user = {
        "id": 2,
        "email": "new@example.com",
        "name": "New User",
        "department": "IT",
        "role": "Admin",
        "status": "Active",
        "is_active": True,
    }

    monkeypatch.setattr(
        controller,
        "create_user_db",
        lambda user: expected_user,
    )

    result = controller.create_management_user(user_data)

    assert result == expected_user


def test_update_user_not_found(monkeypatch):
    user_data = UserManagementCreate(
        email="updated@example.com",
        name="Updated User",
        department="IT",
        role="Admin",
        status="Active",
    )

    monkeypatch.setattr(
        controller,
        "update_user_db",
        lambda user_id, user: None,
    )

    with pytest.raises(Exception) as exc_info:
        controller.update_management_user(999, user_data)

    assert exc_info.value.status_code == 404


def test_delete_user_success(monkeypatch):
    monkeypatch.setattr(
        controller,
        "delete_user_db",
        lambda user_id: True,
    )

    result = controller.delete_management_user(1)

    assert result == {
        "message": "User deleted successfully"
    }


def test_delete_user_not_found(monkeypatch):
    monkeypatch.setattr(
        controller,
        "delete_user_db",
        lambda user_id: False,
    )

    with pytest.raises(Exception) as exc_info:
        controller.delete_management_user(999)

    assert exc_info.value.status_code == 404