from fastapi import APIRouter, status, HTTPException, FastAPI
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from pydantic.user import Role

users_db = {}
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# app = FastAPI() # Since the app is already instaniated in main.py, all we need to do here is set up the router (below)
router = APIRouter()

class UserSignup(BaseModel):
    # Profile Fields
    firstName: str = Field(min_length=1)
    lastName: str = Field(min_length=1)
    email: EmailStr
    password: str = Field(min_length=6)
    role: Role
    avatar: str

    # Address Fields
    city: str = Field(min_length=1)
    state: str = Field(min_length=2, max_length=50)
    zipCode: int
    # city: str
    # state: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignup):
    if user.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already exists"
        )
    hashed_password = hash_password(user.password)

    users_db[user.email] = {
        "email": user.email,
        "hashed_password": hashed_password
    }

    return {"message": "User successfully created"}
