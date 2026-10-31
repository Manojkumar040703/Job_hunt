from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.schemas.schemas import AIQueryRequest, AIQueryResponse
from app.services.ai_service import process_ai_career_query
from app.api.deps import get_current_user
from app.models.entities import User
from typing import Optional

router = APIRouter(prefix="/ai", tags=["AI Career Assistant"])

@router.post("/query", response_model=AIQueryResponse)
def query_ai_career_assistant(
    data: AIQueryRequest,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    result = process_ai_career_query(
        db=db,
        prompt=data.prompt,
        user_id=user_id,
        candidate_profile=data.candidate_profile
    )
    return result
