from fastapi import APIRouter


from src.auth import controller as auth_controller
from src.users import controller as user_controller
from src.audit_logs import controller as audit_logs_controller
from src.reports_analytics import controller as report_analytics_controller
from src.compliance import controller as compliance_controller
from src.organization import controller as organization_controller
from src.renewals import controller as renewal_controller
from src.user_setting import controller as user_setting_contraller
from src.notifications import controller as notification_controller
from src.contracts import controller as contracts_controller
from src.obligations import controller as obligations_controller
#from src.dashboards import controller as dashboard_controller
#from src.chatbot import controller as chatbot_controller

router = APIRouter()

router.include_router(auth_controller.router, tags=["Authentication"])
router.include_router(user_controller.router, tags=["Users"])
#router.include_router(dashboard_controller.router, tags=["Dashboards"])
#router.include_router(chatbot_controller.router, tags=["Chatbot"])
router.include_router(organization_controller.router, tags=["Organization"])
router.include_router(notification_controller.router, tags=["Notifications"])
router.include_router(user_setting_contraller.router, tags=["User Setting"])
router.include_router(audit_logs_controller.router, tags=["Audit Logs"])
router.include_router(report_analytics_controller.router, tags=["Reports"])
router.include_router(compliance_controller.router, tags=["Compliance"])
router.include_router(renewal_controller.router, tags=["Renewals"])
router.include_router(contracts_controller.router, tags=["Contracts"])
router.include_router(obligations_controller.router, tags=["Obligations"])
