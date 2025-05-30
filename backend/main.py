from fastapi import FastAPI
from models import user
from routes.auth import router as auth_router
from routes import contact
from routes import report_issue
from routes import suggestion
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
app.include_router(contact.router)
app.include_router(report_issue.router)
app.include_router(suggestion.router)  
@app.get("/")
def root():
    return {"message": "StreetVoice Backend is running!"}
