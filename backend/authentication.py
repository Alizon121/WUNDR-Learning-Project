from fastapi import APIRouter, status, HTTPException, FastAPI
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

users_db = {}
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# router = APIRouter()
app = FastAPI()

class UserSignup(BaseModel):
    # firstName: str
    # lastName: str
    email: EmailStr
    password: str
    # address: str
    # city: str
    # state: str

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

@app.post("/signup", status_code=status.HTTP_201_CREATED)
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
