from fastapi import FastAPI
from models import user
from routes.auth import router as auth_router
from routes import db_debug
from fastapi.middleware.cors import CORSMiddleware

# Create FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],         # Allow all origins (for testing)
    allow_credentials=True,
    allow_methods=["*"],         # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],         # Allow all headers
)

# Register routers with prefixes
app.include_router(auth_router)
app.include_router(db_debug.router)

@app.get("/")
def root():
    return {"message": "StreetVoice Backend is running!"}
