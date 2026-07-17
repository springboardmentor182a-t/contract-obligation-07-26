import os

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.auth.security import hash_password, verify_password
from src.auth.service import AuthService
from src.database.core import Base
from src.database.models import UserModel


TEST_DATABASE_URL = os.getenv("DATABASE_URL")

if not TEST_DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is required for PostgreSQL tests."
    )


@pytest.fixture(scope="function")
def db_session():
    engine = create_engine(
        TEST_DATABASE_URL,
        pool_pre_ping=True,
    )

    # ప్రతి test ముందు clean tables create చేస్తుంది.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)
        engine.dispose()


def test_hash_and_verify_password():
    password = "StrongPassword@123"

    hashed_password = hash_password(password)

    assert isinstance(hashed_password, str)
    assert verify_password(password, hashed_password) is True
    assert verify_password(
        "WrongPassword@123",
        hashed_password,
    ) is False


def test_register_creates_user(db_session):
    service = AuthService()

    class RegisterRequest:
        name = "Tester"
        organization = "ContractIQ"
        department = "Legal"
        phone = "+1000000000"
        email = "tester@example.com"
        password = "StrongPassword@123"
        role = "Employee"

    request = RegisterRequest()

    result = service.register(
        request,
        db_session,
    )

    assert result["message"] == "User registered successfully"
    assert result["email"] == "tester@example.com"
    assert result["role"] == "Employee"

    user = (
        db_session.query(UserModel)
        .filter(UserModel.email == request.email)
        .first()
    )

    assert user is not None
    assert user.email == request.email
    assert user.password != request.password
    assert verify_password(
        request.password,
        user.password,
    ) is True