from fastapi import APIRouter, status, Depends
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from login import get_current_active_user

router = APIRouter()

@router.get("/children", status_code=status.HTTP_200_OK)
async def get_children(
    current_user: Annotated[User, Depends(get_current_active_user)]
):
    children = await db.users.find_many(
        where={"id": current_user.id}
    )
    return children