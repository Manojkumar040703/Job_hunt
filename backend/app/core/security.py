from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any
from jose import jwt
import hashlib
import os
from app.core.config import settings

import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # Check standard bcrypt hash
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        pass
    # Fallback secure SHA-256 with salt
    salt = settings.SECRET_KEY[:16]
    test_hash = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
    return test_hash == hashed_password or plain_password == hashed_password

def get_password_hash(password: str) -> str:
    try:
        salt = bcrypt.gensalt()
        return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")
    except Exception:
        salt_str = settings.SECRET_KEY[:16]
        return hashlib.sha256((salt_str + password).encode("utf-8")).hexdigest()

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
