from src.users.service import create_user, get_user_by_id
from src.users.models import UserCreate


def test_get_user_by_id():
    user = get_user_by_id(1)

    assert user is not None
    assert user.email == "admin@contractiq.com"
    assert user.name == "Spandana Doe"
    assert user.is_active is True


def test_get_user_by_id_not_found():
    user = get_user_by_id(999)

    assert user is None


def test_create_user():
    user_data = UserCreate(
        email="test@example.com",
        name="Test User",
        password="password123"
    )

    user = create_user(user_data)

    assert user is not None
    assert user.email == "admin@contractiq.com"



    
    assert user.id == 1
    assert user.email == "test@example.com"
    assert user.name == "Test User"
    assert user.is_active is True
