from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import submission
from models import Base
from database import engine

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dynamic Form Platform API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route module
app.include_router(submission.router)
