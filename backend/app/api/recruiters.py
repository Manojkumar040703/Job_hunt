from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import User, RecruiterProfile
from app.schemas.schemas import UserResponse

router = APIRouter(prefix="/recruiters", tags=["Recruiters"])

@router.get("", response_model=List[UserResponse])
def get_verified_recruiters(db: Session = Depends(get_db)):
    # Returns active recruiters (Ravikumar, Divya)
    return db.query(User).filter(User.role == "recruiter", User.is_active == True).all()
