from datetime import datetime, timedelta
from typing import Optional
import os

from passlib.context import CryptContext
from jose import jwt, JWTError

# Use environment variable in production. Keep a safe default for local dev
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_THIS_TO_A_RANDOM_SECRET_IN_PROD")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    # bcrypt has a 72-byte limit. Truncate the password bytes to 72 before hashing.
    pw_bytes = password.encode('utf-8')
    if len(pw_bytes) > 72:
        pw_bytes = pw_bytes[:72]
        # decode back to string ignoring incomplete chars at the end
        password = pw_bytes.decode('utf-8', errors='ignore')
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Ensure verification uses the same truncation logic (72 bytes)
    pw_bytes = plain_password.encode('utf-8')
    if len(pw_bytes) > 72:
        pw_bytes = pw_bytes[:72]
        plain_password = pw_bytes.decode('utf-8', errors='ignore')
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
