from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from models.user import users, pwd_context
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Environment variables for JWT secret and expiration
SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_key")  # Fallback if missing
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Router setup
router = APIRouter()

# User schema
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Helper functions
def get_hashed_password(password: str):
    """Hash plain password."""
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    """Verify hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Register endpoint
@router.post("/register", status_code=201)
async def register(user: UserCreate):
    """Register new users."""
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_hashed_password(user.password)
    
    new_user = {
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    users.insert_one(new_user)

    return {"msg": "User registered successfully"}

# Login endpoint
@router.post("/login")
async def login(user: UserLogin):
    """Login existing users and generate JWT."""
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    db_user = users.find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate JWT token
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token, 
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout():
    """Logout the user (Invalidate server-side session)."""
    # There is no server-side session in JWT-based authentication, so you don't need to do anything here.
    # The client will simply remove the token from localStorage.
    return {"msg": "User logged out successfully"}

@router.get("/users")
async def get_users():
    """Fetch all users from the database for verification."""
    try:
        all_users = list(users.find({}, {"_id": 0, "email": 1, "created_at": 1}))
        return {"users": all_users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))