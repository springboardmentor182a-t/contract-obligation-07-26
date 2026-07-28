import pytest
from unittest.mock import MagicMock
from compliance.service import get_dashboard_summary, get_risk_distribution
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
