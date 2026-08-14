import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Set required environment variables for testing before any application code is imported
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key"

import src.entities.audit_logs
import src.entities.compliance
import src.entities.contract
import src.entities.notification
import src.entities.obligation
import src.entities.organization
import src.entities.otp
import src.entities.renewal
import src.entities.report
import src.entities.user
import src.entities.users_settings
