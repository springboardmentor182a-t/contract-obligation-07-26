import os

# Set required environment variables for testing before any application code is imported
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["SECRET_KEY"] = "test-secret-key"

# Import all entities to ensure SQLAlchemy mapper registry compiles successfully during unit tests
import entities.audit_logs
import entities.compliance
import entities.contract
import entities.notification
import entities.obligation
import entities.organization
import entities.otp
import entities.renewal
import entities.report
import entities.user
import entities.users_settings
