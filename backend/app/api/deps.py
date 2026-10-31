from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, get_db
from app.core.config import settings
from app.models.entities import User, AuditLog
from datetime import datetime, timezone

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=False)

def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> Optional[User]:
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
    except JWTError:
        return None

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        return None
    return user

def get_current_authenticated_user(
    current_user: Optional[User] = Depends(get_current_user)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided or invalid",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

def require_admin(
    current_user: User = Depends(get_current_authenticated_user)
) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Requires Administrator role (Manojkumar)"
        )
    return current_user

def require_recruiter_or_admin(
    current_user: User = Depends(get_current_authenticated_user)
) -> User:
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Requires Recruiter or Administrator authorization"
        )
    return current_user

def log_audit_event(
    db: Session,
    actor_email: str,
    action: str,
    resource: str,
    details: dict = None,
    user_id: str = None
):
    try:
        log = AuditLog(
            user_id=user_id,
            actor_email=actor_email,
            action=action,
            resource=resource,
            details=details or {},
            created_at=datetime.now(timezone.utc)
        )
        db.add(log)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"[Audit Log Error] {e}")
