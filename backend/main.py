from fastapi import FastAPI
from routers import auth
from db.prisma_client import db

# instantiate FastAPI app and Prisma db client
app = FastAPI()

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
