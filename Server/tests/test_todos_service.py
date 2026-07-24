from unittest.mock import MagicMock

from renewals.service import send_reminder_action
from entities.renewal import RenewalReminder


def test_send_reminder_action_marks_reminders_as_sent():
    # Create a fake reminder
    reminder = RenewalReminder()
    reminder.sent = False
    reminder.sent_at = None

    # Create a fake database
    db = MagicMock()
    db.query.return_value.filter.return_value.all.return_value = [reminder]

    # Call the function
    result = send_reminder_action(db, renewal_id=1)

    # Check the result
    assert result["sent_count"] == 1

    # Check reminder was updated
    assert reminder.sent is True
    assert reminder.sent_at is not None

    # Check database commit happened
    db.commit.assert_called_once()


def test_send_reminder_action_returns_none_when_no_reminders():
    # Create a fake database
    db = MagicMock()

    # No reminders found
    db.query.return_value.filter.return_value.all.return_value = []

    # Call the function
    result = send_reminder_action(db, renewal_id=1)

    # Function should return None
    assert result is None

    # Database should not commit anything
    db.commit.assert_not_called()