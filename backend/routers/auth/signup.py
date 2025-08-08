from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel, Field, HttpUrl
from typing import List
from backend.models.user_models import ChildCreate, Role
from backend.db.prisma_client import db
from datetime import datetime, timezone, timedelta, date
from .utils import hash_password
from .login import create_access_token
from dotenv import load_dotenv
import os

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# Router
router = APIRouter()

# UserSignup Pydantic Model
class UserSignup(BaseModel):
    # Profile Fields
    firstName: str = Field(min_length=1, max_length=50)
    lastName: str = Field(min_length=1, max_length=50)
    email: str = Field(pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(min_length=6)
    role: Role
    # avatar: HttpUrl

    # Address Fields
    city: str = Field(min_length=2, max_length=50)
    state: str = Field(min_length=2, max_length=50)
    zipCode: int

    # Children
    children: List[ChildCreate] = Field(default_factory=list)

# Signup Route
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):

    # print("LOOK HERE", user.children)

    existing_user = await db.users.find_unique(
        where={"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    created_user = await db.users.create(
        data={
            "firstName": user.firstName,
            "lastName": user.lastName,
            "email": user.email,
            "role": user.role.lower(),
            # "avatar": str(user.avatar),
            "password": hashed_password,
            "city": user.city,
            "state": user.state,
            "zipCode": user.zipCode,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "children": [],
                "create": [child.model_dump(mode="json") for child in user.children]

        }
    )

    # Generate Access token after signup
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": created_user.email},
        expires_delta=access_token_expires
    )

    return {
        "user": created_user,
        "token": access_token,
        "token_type": "bearer",
        "message": "User successfully created"
    }
