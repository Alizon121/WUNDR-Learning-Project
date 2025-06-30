from fastapi import FastAPI, Depends
# from fastapi.security import OAuth2PasswordBearer
# from prisma import Prisma
from routers import auth
# from typing import Annotated
from db.prisma_client import db
# from models.user_models import User

# instantiate FastAPI app and Prisma db client
app = FastAPI()
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# When we start the app, connect to the db. When we shut down the app, disconnect
@app.on_event("startup")
async def startup():
    await db.connect()

@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()

# Main routes
@app.get('/')
def read_root():
    return {"Hello": "World"}

# Routers
app.include_router(auth.router, prefix="/auth")

# @app.get("/items/")
# async def read_items(token: Annotated[str,Depends(oauth2_scheme)]):
#     return {"token": token}

# def fake_decode_token(token):
#     return User(
#         username=token + "fakedecoded", email="john@example.com", full_name="John Doe"
#     )

# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     user = fake_decode_token(token)
#     return user

# @app.get("/users/me")
# async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
#     return current_user
