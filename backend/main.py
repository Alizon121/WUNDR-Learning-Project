from fastapi import FastAPI, Depends
from routers.auth.routes import router as auth_router
from routers.user import router as user_router
from routers.child import router as child_router
from routers.activities import router as activity_router
from routers.events import router as event_rouer
from db.prisma_client import db

# ! uvicorn main:app --reload
# ! prisma db push
# ! prisma generate
# ! jt.DomW1zOmMio9dA5ybrymnr@kQnoe9ChGw0avJa27VzH4.NsckKAguFtHjy


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
app.include_router(auth_router, prefix="/auth")

app.include_router(user_router, prefix="/user")

app.include_router(child_router, prefix="/child")

app.include_router(activity_router, prefix="/activity")

app.include_router(event_rouer, prefix="/event")

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
