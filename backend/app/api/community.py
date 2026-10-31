from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import CommunityPost, PostComment, User
from app.api.deps import get_current_authenticated_user

router = APIRouter(prefix="/community", tags=["Professional Community & Feed"])

class CreatePostRequest(BaseModel):
    content: str
    image_url: Optional[str] = None
    category: str = "career"
    district: str = "Chennai"

class CommentRequest(BaseModel):
    content: str

@router.get("/posts")
def get_posts(db: Session = Depends(get_db)):
    posts = db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).limit(50).all()
    return [
        {
            "id": p.id,
            "authorName": p.author_name,
            "authorRole": p.author_role,
            "authorCompany": p.author_company,
            "authorAvatar": p.author_avatar,
            "content": p.content,
            "imageUrl": p.image_url,
            "category": p.category,
            "district": p.district,
            "likesCount": p.likes_count,
            "commentsCount": p.comments_count,
            "createdAt": p.created_at.isoformat()
        }
        for p in posts
    ]

@router.post("/posts")
def create_post(
    data: CreatePostRequest,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    post = CommunityPost(
        author_id=current_user.id,
        author_name=current_user.name,
        author_role=current_user.title or ("Recruiter" if current_user.role == "recruiter" else "Job Seeker"),
        author_company=current_user.company,
        content=data.content,
        image_url=data.image_url,
        category=data.category,
        district=data.district or current_user.district or "Chennai"
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "id": post.id,
        "authorName": post.author_name,
        "content": post.content,
        "district": post.district,
        "message": "Post published to Tamil Nadu career feed"
    }

@router.post("/posts/{post_id}/like")
def like_post(post_id: str, db: Session = Depends(get_db)):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes_count += 1
    db.commit()
    return {"likesCount": post.likes_count}

@router.post("/posts/{post_id}/comments")
def add_comment(
    post_id: str,
    data: CommentRequest,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = PostComment(
        post_id=post_id,
        author_id=current_user.id,
        author_name=current_user.name,
        content=data.content
    )
    post.comments_count += 1
    db.add(comment)
    db.commit()

    return {"message": "Comment added", "commentsCount": post.comments_count}
