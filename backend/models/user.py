from fastapi import APIRouter
from pymongo import MongoClient
from passlib.context import CryptContext
from dotenv import load_dotenv
import os

# Environment setup
load_dotenv()
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client["StreetVoice"]  # Replace with your actual database name
users = db["users"]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# Example route to test
@router.get("/test")
async def test():
    return {"message": "User router is working!"}
