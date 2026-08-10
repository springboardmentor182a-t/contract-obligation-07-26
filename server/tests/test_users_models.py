import pytest
from pydantic import ValidationError

from src.users.models import (
    UserCreate,
    UserManagementCreate,
)


def test_user_create_valid_data():
    user = UserCreate(
        email="test@example.com",
        name="Test User",
        password="password123",
    )

    assert user.email == "test@example.com"
    assert user.name == "Test User"
    assert user.password == "password123"


def test_user_create_invalid_email():
    with pytest.raises(ValidationError):
        UserCreate(
            email="invalid-email",
            name="Test User",
            password="password123",
        )


def test_user_management_create_default_status():
    user = UserManagementCreate(
        email="admin@example.com",
        name="Admin User",
        department="IT",
        role="Admin",
    )

    assert user.status == "Active"


def test_user_management_create_custom_status():
    user = UserManagementCreate(
        email="user@example.com",
        name="Regular User",
        department="Finance",
        role="Manager",
        status="Inactive",
    )

    assert user.status == "Inactive"


def test_user_management_create_requires_department():
    with pytest.raises(ValidationError):
        UserManagementCreate(
            email="user@example.com",
            name="Regular User",
            role="Manager",
        )


def test_user_management_create_requires_role():
    with pytest.raises(ValidationError):
        UserManagementCreate(
            email="user@example.com",
            name="Regular User",
            department="IT",
        )