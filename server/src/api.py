from fastapi import APIRouter

from src.auth.controller import router as auth_router
from src.todos.controller import router as todos_router
from src.users.controller import router as users_router
from src.renewals.controller import router as renewals_router
from src.obligations.controller import router as obligations_router
from src.profile.controller import router as profile_router
from src.settings_module.controller import router as settings_router
from src.notifications.controller import router as notifications_router
from src.analytics.controller import router as analytics_router
from src.support.controller import router as support_router
from src.quick_actions.controller import router as quick_actions_router
from src.health.controller import router as health_router
from src.audit.controller import router as audit_router
from src.compliance.controller import router as compliance_router
from src.forecast.controller import router as forecast_router

api_router = APIRouter(prefix="/api")

api_router.include_router(auth_router)
api_router.include_router(todos_router)
api_router.include_router(users_router)
api_router.include_router(renewals_router)
api_router.include_router(profile_router)
api_router.include_router(settings_router)
api_router.include_router(notifications_router)
api_router.include_router(analytics_router)
api_router.include_router(support_router)
api_router.include_router(quick_actions_router)
api_router.include_router(health_router)
api_router.include_router(audit_router)
api_router.include_router(obligations_router)
api_router.include_router(compliance_router)
api_router.include_router(forecast_router)


