from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from models.user import users, pwd_context
from datetime import datetime, timedelta
import jwt
import os
from dotenv import load_dotenv
from dependencies import get_current_user_email

# Load env variables
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter()

# ---------------- SCHEMAS ----------------

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class CompleteProfile(BaseModel):
    full_name: str
    phone: str | None = None
    role: str  # "user" or "admin"
    department: str | None = None  # Only for admin
    location: str | None = None    # Only for admin
    admin_code: str | None = None  # Only for admin

# ---------------- HELPERS ----------------

def get_hashed_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# ---------------- ROUTES ----------------

@router.post("/register", status_code=201)
async def register(user: UserCreate):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    if users.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_hashed_password(user.password)
    
    new_user = {
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.utcnow(),
        "full_name": None,
        "phone": None,
        "role": None,
        "department": None,
        "location": None,
        "admin_code": None
    }
    
    users.insert_one(new_user)
    return {"msg": "User registered successfully"}

@router.post("/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    db_user = users.find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
async def get_me(email: str = Depends(get_current_user_email)):
    user = users.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/complete-profile")
async def complete_profile(data: CompleteProfile, email: str = Depends(get_current_user_email)):
    update_data = {
        "full_name": data.full_name,
        "phone": data.phone,
        "role": data.role
    }

    if data.role == "admin":
        update_data["department"] = data.department
        update_data["location"] = data.location
        update_data["admin_code"] = data.admin_code
    else:
        update_data["department"] = None
        update_data["location"] = None
        update_data["admin_code"] = None

    result = users.update_one({"email": email}, {"$set": update_data})

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Profile not updated")
    
    return {"msg": "Profile completed successfully"}

@router.post("/logout")
async def logout():
    return {"msg": "User logged out successfully"}

@router.get("/users")
async def get_users():
    try:
        all_users = list(users.find({}, {"_id": 0, "email": 1, "created_at": 1}))
        return {"users": all_users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
