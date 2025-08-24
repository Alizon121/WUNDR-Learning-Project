# backend/routers/check_admins.py
from fastapi import APIRouter
from backend.db.prisma_client import db

router = APIRouter()

@router.get("/check-admins", tags=["debug"])
async def check_admins():
    admins = await db.users.find_many(where={"role": "admin"})
    return {"count": len(admins), "emails": [a.email for a in admins]}
