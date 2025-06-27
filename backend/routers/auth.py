from fastapi import APIRouter, status, HTTPException, FastAPI
from pydantic import BaseModel, Field, HttpUrl, EmailStr
from typing import List
from passlib.context import CryptContext
from models.user_models import ChildCreate, Role
from db import mongo

# Database
users_db = {}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

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
    avatar: HttpUrl

    # Address Fields
    city: str = Field(min_length=2, max_length=50)
    state: str = Field(min_length=2, max_length=50)
    zipCode: int

    # Children
    children: List[ChildCreate] = Field(default_factor=list)

# Signup Route
@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):

    existing_user = await mongo.user.find_unique(
        where={"profile": {"email": user.email}}
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )

    # if user.email in users_db:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Email already exists"
    #     )

    # hashed_password = hash_password(user.password)

    # users_db[user.email] = {
    #     "email": user.email,
    #     "hashed_password": hashed_password
    # }

    # return {"message": "User successfully created"}
