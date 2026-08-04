import pytest
from unittest.mock import MagicMock
from compliance.service import get_dashboard_summary, get_risk_distribution, get_anomalies
from entities.compliance import Compliance

def test_get_dashboard_summary_empty():
    """
    Test Case 1: get_dashboard_summary returns a default zeroed structure
    when there are no compliance records in the database.
    """
    db_mock = MagicMock()
    query_mock = MagicMock()
    db_mock.query.return_value = query_mock
    
    # Mock total count is 0
    query_mock.count.return_value = 0

    result = get_dashboard_summary(db_mock)

    assert result["compliance_score"] == 0.0
    assert result["compliant_contracts"] == 0
    assert result["critical_violations"] == 0
    assert result["pending_audits"] == 0
    assert result["compliant_contracts_trend"] == "No records"


def test_get_risk_distribution_with_data():
    """
    Test Case 2: get_risk_distribution returns correct risk levels
    counts (High, Medium, Low) by querying database with filters.
    """
    db_mock = MagicMock()
    query_mock = MagicMock()
    filter_query_mock = MagicMock()
    
    db_mock.query.return_value = query_mock
    
    # First count is total_count (return 10 to bypass empty check)
    query_mock.count.return_value = 10
    
    # filter() returns the filtered query mock
    query_mock.filter.return_value = filter_query_mock
    
    # The subsequent count() calls on filter query return High, Medium, Low counts
    filter_query_mock.count.side_effect = [3, 5, 2]

    result = get_risk_distribution(db_mock)

    assert result["high"] == 3
    assert result["medium"] == 5
    assert result["low"] == 2
    
    # Verify filters were called with correct conditions
    assert query_mock.filter.call_count == 3

def test_get_anomalies_detection():
    from datetime import datetime, timedelta
    db_mock = MagicMock()
    query_mock = MagicMock()
    db_mock.query.return_value = query_mock
    
    # Create mock contracts
    # Anomaly 1: Duplicate (contracts c1 and c2 match identical values)
    c1 = MagicMock()
    c1.contract_id = 1
    c1.vendor_name = "Acme Corp"
    c1.category = "Vendor Contracts"
    c1.contract_value = 1000
    c1.status = "Draft"
    c1.approval_date = None
    c1.effective_date = datetime.now()
    c1.expiry_date = datetime.now() + timedelta(days=30)
    
    c2 = MagicMock()
    c2.contract_id = 2
    c2.vendor_name = "Acme Corp"
    c2.category = "Vendor Contracts"
    c2.contract_value = 1000
    c2.status = "Draft"
    c2.approval_date = None
    c2.effective_date = datetime.now()
    c2.expiry_date = datetime.now() + timedelta(days=30)
    
    # Anomaly 2: Active without approval date
    c3 = MagicMock()
    c3.contract_id = 3
    c3.vendor_name = "Beta Inc"
    c3.category = "Service Agreements"
    c3.contract_value = 5000
    c3.status = "Active"
    c3.approval_date = None
    c3.effective_date = datetime.now()
    c3.expiry_date = datetime.now() + timedelta(days=30)
    
    query_mock.all.return_value = [c1, c2, c3]
    
    # Call service
    result = get_anomalies(db_mock)
    
    # Check that anomalies list contains both expected categories
    categories = [r["category"] for r in result]
    assert "Duplicate Entry" in categories
    assert "Missing Approval" in categories
    assert len(result) >= 2
