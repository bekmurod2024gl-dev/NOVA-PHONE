from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models.product import Product
from app.models.user import User
from app.routers.products import router as products_router
from app.routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NOVA-PHONE API",
    version="1.0.0",
    description="NOVA-PHONE Management System Backend"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://nova-phone-39pg.vercel.app",
        "https://nova-phone-39pg-git-main-bekmurod.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "success": True,
        "message": "NOVA-PHONE Backend ishlayapti!",
        "version": "1.0.0"
    }


@app.get("/health")
def health():
    return {
        "status": "OK",
        "server": "Running"
    }