from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, Form, File
from pydantic import BaseModel
from models.user import users, pwd_context
from jose import JWTError, jwt
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
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


async def get_current_user(token: str = Depends(oauth2_scheme)):
    # First, get email (reuse existing logic)
    email = await get_current_user_email(token)

    # Fetch user details from DB using email
    user = users.find_one({"email": email})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Convert ObjectId to str if needed
    user["_id"] = str(user["_id"])

    return user