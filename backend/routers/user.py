from fastapi import APIRouter, status, Depends
from db.prisma_client import db
from typing import Annotated
from models.user_models import User
from .auth.login import get_current_active_user

router = APIRouter()


# Make a route for updating user's children

# Make a route for updating a user