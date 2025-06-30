from fastapi import APIRouter
from .login import router as login_router
from .signup import router as signup_router

router = APIRouter()
router.include_router(login_router)
router.include_router(signup_router)
