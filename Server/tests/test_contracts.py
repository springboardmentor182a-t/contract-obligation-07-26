import pytest

from src.contracts import service
from unittest.mock import MagicMock, patch

def test_get_contracts():
    # Arrange: Mock the database session and query execution
    mock_db = MagicMock()
    mock_query = MagicMock()
    
    mock_contract = MagicMock()
    mock_contract.contract_id = 1
    mock_contract.vendor_name = "ABC Technologies"
    mock_contract.contract_value = 50000

    mock_db.query.return_value = mock_query
    mock_query.all.return_value = [mock_contract]

    # Act: Call the service function
    result = service.get_contracts(mock_db)

    # Assert: Verify output structure
    assert isinstance(result, list)
    assert len(result) == 1
    assert result[0].vendor_name == "ABC Technologies"


def test_get_contract_by_id():
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    
    mock_contract = MagicMock()
    mock_contract.contract_id = 1
    mock_contract.vendor_name = "ABC Technologies"

    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_contract

    result = service.get_contract_by_id(mock_db, 1)

    assert result is not None
    assert result.contract_id == 1


@patch("src.contracts.service.Contract")
def test_create_contract(mock_contract_class):
    mock_db = MagicMock()
    
    # Simulate all attributes coming from the frontend/model
    contract_data = {
        "title": "Software Services Agreement",
        "vendor": "ABC Technologies",
        "type": "Service Agreement",
        "value": "$50,000",
        "startDate": "2024-01-15",
        "end_date": "2025-01-15",
        "owner": "John Doe",
        "status": "Active",
        "compliance": "95%",
        "summary": "This is a software services contract.",
        "autoRenewal": "Yes",
        "paymentTerms": "Monthly",
        "governingLaw": "Indian Law",
        "liabilityCap": "$10,000",
    }

    mock_contract_create = MagicMock()
    mock_contract_create.model_dump.return_value = contract_data

    result = service.create_contract(mock_db, mock_contract_create)

    # Assert that Contract was initialized with whatever dictionary was dumped
    mock_contract_class.assert_called_once_with(**contract_data)
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()

def test_update_contract():
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    
    mock_contract = MagicMock()
    mock_contract.contract_id = 1
    mock_contract.vendor_name = "Old Name"

    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_contract

    mock_contract_update = MagicMock()
    mock_contract_update.model_dump.return_value = {
        "vendor_name": "New Technologies"
    }

    result = service.update_contract(mock_db, 1, mock_contract_update)

    assert result is not None
    assert result.vendor_name == "New Technologies"
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()


def test_delete_contract():
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    
    mock_contract = MagicMock()
    mock_contract.contract_id = 1
    mock_contract.vendor_name = "ABC Technologies"

    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    mock_filter.first.return_value = mock_contract

    result = service.delete_contract(mock_db, 1)

    assert result is True
    mock_db.delete.assert_called_once()
    mock_db.commit.assert_called_once()