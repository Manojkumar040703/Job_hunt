from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.db.database import get_db
from app.models.entities import DirectMessage, User
from app.api.deps import get_current_authenticated_user

router = APIRouter(prefix="/messages", tags=["Direct Messaging"])

class SendMessageRequest(BaseModel):
    receiver_id: str
    content: str
    attachment_url: Optional[str] = None

@router.get("/conversations")
def get_conversations(
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    # Fetch messages involving current user
    messages = (
        db.query(DirectMessage)
        .filter(or_(DirectMessage.sender_id == current_user.id, DirectMessage.receiver_id == current_user.id))
        .order_by(DirectMessage.created_at.desc())
        .limit(100)
        .all()
    )

    # Group by other party
    conversations = {}
    for m in messages:
        other_id = m.receiver_id if m.sender_id == current_user.id else m.sender_id
        other_name = m.receiver_name if m.sender_id == current_user.id else m.sender_name
        if other_id not in conversations:
            conversations[other_id] = {
                "id": other_id,
                "name": other_name,
                "lastMessage": m.content,
                "lastTime": m.created_at.strftime("%I:%M %p"),
                "unread": 0 if m.is_read or m.sender_id == current_user.id else 1
            }

    return list(conversations.values())

@router.get("/{other_user_id}")
def get_thread(
    other_user_id: str,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    thread = (
        db.query(DirectMessage)
        .filter(
            or_(
                and_(DirectMessage.sender_id == current_user.id, DirectMessage.receiver_id == other_user_id),
                and_(DirectMessage.sender_id == other_user_id, DirectMessage.receiver_id == current_user.id)
            )
        )
        .order_by(DirectMessage.created_at.asc())
        .all()
    )

    return [
        {
            "id": m.id,
            "senderId": m.sender_id,
            "senderName": m.sender_name,
            "content": m.content,
            "attachmentUrl": m.attachment_url,
            "time": m.created_at.strftime("%I:%M %p"),
            "isMe": m.sender_id == current_user.id
        }
        for m in thread
    ]

@router.post("")
def send_message(
    data: SendMessageRequest,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    receiver = db.query(User).filter(User.id == data.receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=404, detail="Recipient user not found")

    msg = DirectMessage(
        sender_id=current_user.id,
        receiver_id=receiver.id,
        sender_name=current_user.name,
        receiver_name=receiver.name,
        content=data.content,
        attachment_url=data.attachment_url
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    return {
        "id": msg.id,
        "senderId": msg.sender_id,
        "senderName": msg.sender_name,
        "content": msg.content,
        "time": msg.created_at.strftime("%I:%M %p"),
        "isMe": True
    }
