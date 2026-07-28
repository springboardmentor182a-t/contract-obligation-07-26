import pytest
from unittest.mock import MagicMock
from dashboards.service import DashboardService

def test_get_admin_dashboard():
    # Arrange: Mock the database session
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    mock_order_by = MagicMock()
    mock_limit = MagicMock()
    
    # Configure the chainable mock
    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    
    mock_query.order_by.return_value = mock_order_by
    mock_filter.order_by.return_value = mock_order_by
    
    mock_order_by.limit.return_value = mock_limit
    
    # Configure final return values
    mock_query.count.return_value = 10
    mock_filter.count.return_value = 5
    
    mock_query.all.return_value = []
    mock_filter.all.return_value = []
    mock_limit.all.return_value = []
    
    # Group by chaining
    mock_query.group_by.return_value.order_by.return_value.all.return_value = []

    # Act: Call the service function
    result = DashboardService.get_admin_dashboard(mock_db)
    
    # Assert: Verify the expected behavior and calculations
    assert "total_users" in result
    assert result["total_users"] == 10  # from mock_query.count()
    
    assert "active_contracts" in result
    assert result["active_contracts"] == 5  # from mock_filter.count()
    
    assert "system_health" in result
    assert result["system_health"]["active_sessions"] == 10

def test_get_legal_manager_dashboard():
    # Arrange: Mock the database session
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    
    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    
    # Configure final return values
    mock_query.count.return_value = 8
    mock_filter.count.return_value = 4
    
    mock_query.all.return_value = []
    mock_filter.all.return_value = []
    
    mock_query.group_by.return_value.all.return_value = []
    mock_filter.order_by.return_value.limit.return_value.all.return_value = []

    # Act: Call the service function
    result = DashboardService.get_legal_manager_dashboard(mock_db)
    
    # Assert: Verify the expected behavior and structure
    assert "pending_approvals" in result
    assert result["pending_approvals"] == 4  # from mock_filter.count()
    
    assert "active_contracts" in result
    assert result["active_contracts"] == 4
    
    assert "contract_status" in result
    assert result["contract_status"] == []

def test_get_compliance_officer_dashboard():
    # Arrange: Mock the database session
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    
    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    
    # Configure counts
    mock_query.count.return_value = 100
    mock_filter.count.return_value = 50
    
    # Configure all() returns
    mock_query.all.return_value = []
    mock_filter.all.return_value = []
    
    # Configure joins and group_by for dept data
    mock_query.join.return_value.group_by.return_value.all.return_value = []
    
    # Configure trend data chaining
    mock_query.filter.return_value.group_by.return_value.order_by.return_value.all.return_value = []
    
    # Configure audit summary chaining
    mock_query.filter.return_value.order_by.return_value.limit.return_value.all.return_value = []

    # Act: Call the service function
    result = DashboardService.get_compliance_officer_dashboard(mock_db)
    
    # Assert: Verify the expected behavior and structure
    assert "compliance_score" in result
    assert result["compliance_score"] == 50.0  # 50 / 100 * 100
    
    assert "pending_obligations" in result
    assert result["pending_obligations"] == 50
    
    assert "department_compliance" in result
    assert result["department_compliance"] == []

def test_get_contract_manager_dashboard():
    # Arrange: Mock the database session
    mock_db = MagicMock()
    mock_query = MagicMock()
    mock_filter = MagicMock()
    
    mock_db.query.return_value = mock_query
    mock_query.filter.return_value = mock_filter
    
    # Configure counts
    mock_query.count.return_value = 20
    mock_filter.count.return_value = 10
    
    # Configure all() returns
    mock_query.all.return_value = []
    mock_filter.all.return_value = []
    
    # Configure growth data chaining
    mock_query.filter.return_value.group_by.return_value.order_by.return_value.all.return_value = []
    
    # Configure renewal calendar chaining
    mock_query.filter.return_value.order_by.return_value.limit.return_value.all.return_value = []
    
    # Configure assigned contracts list chaining
    mock_query.outerjoin.return_value.group_by.return_value.order_by.return_value.limit.return_value.all.return_value = []

    # Act: Call the service function
    result = DashboardService.get_contract_manager_dashboard(mock_db)
    
    # Assert: Verify the expected behavior and structure
    assert "assigned_contracts" in result
    assert result["assigned_contracts"] == 10
    
    assert "portfolio_growth" in result
    assert "labels" in result["portfolio_growth"]
    assert "data" in result["portfolio_growth"]
    
    assert "assigned_contracts_list" in result
    assert result["assigned_contracts_list"] == []
