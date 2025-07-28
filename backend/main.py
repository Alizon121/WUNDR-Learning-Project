from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.auth.routes import router as auth_router
from routers.user import router as user_router
from routers.child import router as child_router
from routers.activities import router as activity_router
from routers.events import router as event_router
from routers.reviews import router as review_router
from routers.password_reset import router as password_reset_router
from db.prisma_client import db

# ! Start Application: uvicorn main:app --reload

# ! prisma db push
# ! prisma generate

# ! DEMO email: jt.DomW1zOmMio9dA5ybrymnr@kQnoe9ChGw0avJa27VzH4.NsckKAguFtHjy

# ! Clear PyCache: find . -name "*.pyc" -delete

# ! Activate virtual environment in Python 12: source .venv/bin/activate

# instantiate FastAPI app and Prisma db client
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
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

app.include_router(event_router, prefix="/event")

app.include_router(review_router, prefix="/review")

app.include_router(password_reset_router, prefix="/password_reset")
