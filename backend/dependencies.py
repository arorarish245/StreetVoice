from fastapi import Depends, HTTPException
from jose import JWTError, jwt
from google.auth.transport.requests import Request as GoogleRequest
from google.oauth2 import id_token
import os

SECRET_KEY = os.getenv("JWT_SECRET", "your_super_secret_key")
ALGORITHM = "HS256"
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:

    # Try Google first (it's actually more likely now)
    try:
        idinfo = id_token.verify_oauth2_token(token, GoogleRequest(), GOOGLE_CLIENT_ID)
        # print("Google ID token payload:", idinfo)
        email = idinfo.get("email")
        if email:
            return email
    except Exception as e:
        print("Google verification failed:", e)

    # Fall back to custom JWT (email/password login)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # print("JWT payload:", payload)
        user_id = payload.get("sub")
        if user_id:
            return user_id
    except JWTError as e:
        print("JWT verification failed:", e)

    raise HTTPException(status_code=401, detail="Invalid token: Not JWT or Google")
