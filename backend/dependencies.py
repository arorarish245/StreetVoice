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
    # Try JWT first
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id:
            return user_id
    except JWTError:
        pass  # fall back to Google

    # Try Google
    try:
        idinfo = id_token.verify_oauth2_token(token, GoogleRequest(), GOOGLE_CLIENT_ID)
        email = idinfo.get("email")
        if email:
            return email
    except Exception:
        pass

    raise HTTPException(status_code=401, detail="Invalid token: Not JWT or Google")
