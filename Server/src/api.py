from fastapi import APIRouter

from auth import controller as auth_controller
from users import controller as user_controller
from notifications import controller as notification_controller
from audit_logs import controller as audit_logs_controller
from reports_analytics import controller as report_analytics_controller
from organization import controller as organization_controller

router = APIRouter()

router.include_router(auth_controller.router, tags=["Authentication"])
router.include_router(user_controller.router, tags=["Users"])
router.include_router(organization_controller.router, tags=["Organization"])
router.include_router(notification_controller.router, tags=["Notifications"])
router.include_router(audit_logs_controller.router, tags=["Audit Logs"])
router.include_router(report_analytics_controller.router, tags=["Reports"])
