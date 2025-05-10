from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from google.auth.transport.requests import Request
from google.oauth2 import id_token
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_key")
ALGORITHM = "HS256"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# For JWT login (your own auth)
def get_current_user_id_jwt(token: str = Depends(oauth2_scheme)) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token: No user ID")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# For Google OAuth login
def get_current_user_id_google(token: str = Depends(oauth2_scheme)) -> str:
    try:
        idinfo = id_token.verify_oauth2_token(token, Request(), GOOGLE_CLIENT_ID)
        user_id = idinfo.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid Google token: No user ID")
        return user_id
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
