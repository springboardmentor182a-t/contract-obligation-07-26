import pytest
from unittest.mock import MagicMock
from fastapi import FastAPI
from fastapi.testclient import TestClient
from datetime import datetime

from src.obligations.controller import router
from src.database.core import get_db
from src.entities.obligation import Obligation

# Create a test app
app = FastAPI()
app.include_router(router)

# Fake DB dependency
def override_get_db():
    db = MagicMock()
    yield db

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# ==========================================================
# TEST GET ALL OBLIGATIONS
# ==========================================================
def test_get_all_obligations():
    db = MagicMock()
    
    # Real database model instances to allow standard serialization
    fake_obligation_1 = Obligation(
        obligation_id=1,
        contract_id=10,
        title="Payment Milestone",
        assigned_to="John",
        due_date=datetime(2026, 9, 15),
        status="Pending",
        completed=False
    )
    
    fake_obligation_2 = Obligation(
        obligation_id=2,
        contract_id=11,
        title="Delivery milestone",
        assigned_to="Alice",
        due_date=datetime(2026, 8, 30),
        status="Completed",
        completed=True
    )

    # Mock query behavior
    query_mock = db.query.return_value
    order_mock = query_mock.order_by.return_value
    order_mock.all.return_value = [fake_obligation_1, fake_obligation_2]

    app.dependency_overrides[get_db] = lambda: db

    response = client.get("/obligations/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 2
    assert data[0]["obligation_id"] == 1
    assert data[1]["obligation_id"] == 2

# ==========================================================
# TEST GET OBLIGATIONS FILTERED BY CONTRACT_ID
# ==========================================================
def test_get_obligations_filtered_by_contract():
    db = MagicMock()
    
    fake_obligation = Obligation(
        obligation_id=1,
        contract_id=10,
        title="Payment Milestone",
        assigned_to="John",
        due_date=datetime(2026, 9, 15),
        status="Pending",
        completed=False
    )
    
    query_mock = db.query.return_value
    filter_mock = query_mock.filter.return_value
    order_mock = filter_mock.order_by.return_value
    order_mock.all.return_value = [fake_obligation]

    app.dependency_overrides[get_db] = lambda: db

    response = client.get("/obligations/?contract_id=10")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) == 1
    assert data[0]["contract_id"] == 10

# ==========================================================
# TEST GET SINGLE OBLIGATION SUCCESS
# ==========================================================
def test_get_single_obligation_success():
    db = MagicMock()
    
    fake_obligation = Obligation(
        obligation_id=1,
        contract_id=10,
        title="Payment Milestone",
        assigned_to="John",
        due_date=datetime(2026, 9, 15),
        status="Pending",
        completed=False
    )
    
    query_mock = db.query.return_value
    filter_mock = query_mock.filter.return_value
    filter_mock.first.return_value = fake_obligation

    app.dependency_overrides[get_db] = lambda: db

    response = client.get("/obligations/1")
    assert response.status_code == 200
    
    data = response.json()
    assert data["obligation_id"] == 1
    assert data["title"] == "Payment Milestone"

# ==========================================================
# TEST GET SINGLE OBLIGATION NOT FOUND (404)
# ==========================================================
def test_get_single_obligation_not_found():
    db = MagicMock()
    
    query_mock = db.query.return_value
    filter_mock = query_mock.filter.return_value
    filter_mock.first.return_value = None

    app.dependency_overrides[get_db] = lambda: db

    response = client.get("/obligations/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Obligation with ID 999 not found"
