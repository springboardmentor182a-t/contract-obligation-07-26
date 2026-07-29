from src.users.service import get_user_by_id

def test_get_user_by_id():
    user = get_user_by_id(1)
    assert user is not None
    assert user.email == "admin@contractiq.com"