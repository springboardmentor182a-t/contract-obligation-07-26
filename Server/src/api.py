from fastapi import APIRouter

from auth import controller as auth_controller
from users import controller as user_controller
from notifications import controller as notification_controller

router = APIRouter()

router.include_router(auth_controller.router, tags=["Authentication"])
router.include_router(user_controller.router, tags=["Users"])
router.include_router(notification_controller.router, tags=["Notifications"])
