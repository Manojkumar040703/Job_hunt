from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import Interview, Application, User, Notification, ApplicationStatusHistory
from app.schemas.schemas import InterviewCreate, InterviewResponse
from app.api.deps import get_current_authenticated_user, require_recruiter_or_admin, log_audit_event
from app.services.email_service import send_interview_invitation_email

router = APIRouter(prefix="/interviews", tags=["Interviews"])

@router.get("", response_model=List[InterviewResponse])
def get_interviews(
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "candidate":
        return db.query(Interview).filter(Interview.candidate_id == current_user.id).order_by(Interview.created_at.desc()).all()
    elif current_user.role == "recruiter":
        return db.query(Interview).filter(Interview.recruiter_id == current_user.id).order_by(Interview.created_at.desc()).all()
    elif current_user.role == "admin":
        return db.query(Interview).order_by(Interview.created_at.desc()).all()
    return []

@router.post("", response_model=InterviewResponse, status_code=status.HTTP_201_CREATED)
def schedule_interview(
    data: InterviewCreate,
    current_user: User = Depends(require_recruiter_or_admin),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == data.application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Associated application not found")

    if current_user.role != "admin" and app.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to schedule interviews for this application")

    new_interview = Interview(
        application_id=app.id,
        job_id=app.job_id,
        candidate_id=app.candidate_id,
        candidate_name=app.candidate_name,
        recruiter_id=current_user.id,
        company=app.job.company,
        role=app.job.title,
        round_name=data.round_name,
        date=data.date,
        time=data.time,
        interviewers=data.interviewers or f"{current_user.name} ({current_user.title or 'Talent Lead'})",
        mode=data.mode or "Online Video Meeting",
        meet_url=data.meet_url or "https://meet.google.com/jobhunt-interview",
        instructions=data.instructions or "Please be available 5 minutes prior to the scheduled slot.",
        status="Scheduled"
    )
    db.add(new_interview)

    # Automatically progress application status to 'Interview Scheduled'
    old_status = app.status
    app.status = "Interview Scheduled"
    app.updated_at = datetime.now(timezone.utc)

    history = ApplicationStatusHistory(
        application_id=app.id,
        old_status=old_status,
        new_status="Interview Scheduled",
        changed_by=current_user.name,
        notes=f"Scheduled {data.round_name} on {data.date} at {data.time}"
    )
    db.add(history)

    # In-app notification
    notif = Notification(
        user_id=app.candidate_id,
        title=f"Interview Scheduled: {app.job.title}",
        message=f"{data.round_name} scheduled with {app.job.company} on {data.date} at {data.time}.",
        type="info"
    )
    db.add(notif)
    db.commit()
    db.refresh(new_interview)

    # Send official email invitation to candidate
    send_interview_invitation_email(
        db=db,
        candidate_email=app.candidate_email,
        candidate_name=app.candidate_name,
        company=app.job.company,
        role=app.job.title,
        round_name=data.round_name,
        date=data.date,
        time=data.time,
        meet_url=new_interview.meet_url,
        instructions=new_interview.instructions
    )

    log_audit_event(
        db=db,
        actor_email=current_user.email,
        action="INTERVIEW_SCHEDULED",
        resource="interviews",
        details={
            "interview_id": new_interview.id,
            "candidate": app.candidate_name,
            "date": data.date,
            "round": data.round_name
        },
        user_id=current_user.id
    )

    return new_interview
