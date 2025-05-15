from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, Form, File
from pydantic import BaseModel
from models.user import users, pwd_context
from datetime import datetime, timedelta
import cloudinary.uploader
from io import BytesIO
from PIL import Image
from jose import JWTError, jwt
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer

# Load env variables
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# ---------------- UTILITIES ----------------

def compress_image(upload_file: UploadFile, quality: int = 70):
    image = Image.open(upload_file.file)
    image = image.convert("RGB")  # Ensure RGB
    buffer = BytesIO()
    image.save(buffer, format="JPEG", quality=quality)
    buffer.seek(0)
    return buffer

def upload_image_to_cloudinary(image: UploadFile):
    compressed_file = compress_image(image, quality=70)
    result = cloudinary.uploader.upload(
        compressed_file,
        transformation=[
            {"width": 800, "crop": "scale"},
            {"quality": "auto"},
            {"fetch_format": "auto"},
        ]
    )
    return result["secure_url"]

def get_hashed_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def is_profile_complete(user):
    required_fields = ["full_name", "role"]
    return all(user.get(field) for field in required_fields)

# ---------------- AUTH HELPERS ----------------

async def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    # Try Google token verification first
    try:
        idinfo = id_token.verify_oauth2_token(token, GoogleRequest(), GOOGLE_CLIENT_ID)
        email = idinfo.get("email")
        if email:
            return email
    except Exception:
        pass

    # Fallback to custom JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if user_email:
            return user_email
    except JWTError:
        pass

    raise HTTPException(status_code=401, detail="Invalid authentication credentials")

# ---------------- SCHEMAS ----------------

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

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
        "auth_provider": "local",
        "created_at": datetime.utcnow(),
        "full_name": None,
        "phone": None,
        "role": None,
        "department": None,
        "location": None,
        "admin_code": None,
        "profile_picture": None
    }
    
    users.insert_one(new_user)
    return {"msg": "User registered successfully"}

@router.post("/login")
async def login(user: UserLogin):
    if not user.email or not user.password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    db_user = users.find_one({"email": user.email})
    
    if not db_user or not verify_password(user.password, db_user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    profile_complete = is_profile_complete(db_user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "profile_complete": profile_complete,
        "role": db_user.get("role")
    }


@router.post("/login/google")
async def google_login(token: str = Form(...)):
    # Verify Google token and extract email
    try:
        idinfo = id_token.verify_oauth2_token(token, GoogleRequest(), GOOGLE_CLIENT_ID)
        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Google token did not contain email")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    # Check if user exists, else create with minimal info
    user = users.find_one({"email": email})
    if not user:
        # Create new user with auth_provider = google
        new_user = {
            "email": email,
            "password": None,
            "auth_provider": "google",
            "created_at": datetime.utcnow(),
            "full_name": None,
            "phone": None,
            "role": None,
            "department": None,
            "location": None,
            "admin_code": None,
            "profile_picture": None
        }
        users.insert_one(new_user)
        user = new_user  # Newly created user

    profile_complete = is_profile_complete(user)

    jwt_token = create_access_token(
        data={"sub": email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "profile_complete": profile_complete,
        "role": user.get("role")
    }


@router.get("/me")
async def get_me(email: str = Depends(get_current_user_email)):
    user = users.find_one({"email": email}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/complete-profile")
async def complete_profile(
    full_name: str = Form(...),
    phone: str = Form(None),
    role: str = Form(...),  # "user" or "admin"
    department: str = Form(None),
    location: str = Form(None),
    admin_code: str = Form(None),
    profile_picture: UploadFile = File(None),
    email: str = Depends(get_current_user_email)
):
    update_data = {
        "full_name": full_name,
        "phone": phone,
        "role": role
    }

    if profile_picture:
        image_url = upload_image_to_cloudinary(profile_picture)
        update_data["profile_picture"] = image_url

    # Only admins have these extra fields
    if role.lower() == "admin":
        update_data["department"] = department
        update_data["location"] = location
        update_data["admin_code"] = admin_code
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
    # For stateless JWT, logout is usually handled client-side by deleting token
    return {"msg": "User logged out successfully"}

@router.get("/users")
async def get_users():
    try:
        all_users = list(users.find({}, {"_id": 0, "email": 1, "created_at": 1}))
        return {"users": all_users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
