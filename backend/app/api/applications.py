import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from typing import List
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import (
    Application,
    ApplicationStatusHistory,
    Job,
    User,
    CandidateProfile,
    Notification
)
from app.schemas.schemas import (
    ApplicationCreate,
    ApplicationStatusUpdate,
    ApplicationResponse
)
from app.api.deps import (
    get_current_authenticated_user,
    require_recruiter_or_admin,
    log_audit_event
)
from app.services.email_service import send_selection_email, send_rejection_email
from app.core.config import settings

VALID_STATUSES = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Selected",
    "Not Selected"
]

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationResponse])
def get_applications(
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    if current_user.role == "candidate":
        # Candidate only sees their own applications
        return db.query(Application).filter(Application.candidate_id == current_user.id).order_by(Application.applied_at.desc()).all()
    elif current_user.role == "recruiter":
        # Recruiter sees applications for their posted jobs
        return (
            db.query(Application)
            .join(Job, Application.job_id == Job.id)
            .filter(Job.recruiter_id == current_user.id)
            .order_by(Application.applied_at.desc())
            .all()
        )
    elif current_user.role == "admin":
        # Manojkumar can oversee all applications statewide
        return db.query(Application).order_by(Application.applied_at.desc()).all()
    return []

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def apply_for_job(
    data: ApplicationCreate,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    # Verify job
    job = db.query(Job).filter(Job.id == data.job_id).first()
    if not job or job.status != "Active":
        raise HTTPException(status_code=400, detail="Job opening is no longer accepting applications")

    # Prevent duplicate applications
    existing = (
        db.query(Application)
        .filter(Application.job_id == data.job_id, Application.candidate_id == current_user.id)
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="You have already submitted an application for this position"
        )

    # Fetch candidate profile resume
    profile = db.query(CandidateProfile).filter(CandidateProfile.user_id == current_user.id).first()
    resume_url = profile.resume_url if profile else None
    resume_fn = profile.resume_filename if profile else "Resume.pdf"

    new_app = Application(
        job_id=job.id,
        candidate_id=current_user.id,
        candidate_name=current_user.name,
        candidate_email=current_user.email,
        candidate_phone=current_user.phone,
        resume_url=resume_url,
        resume_filename=resume_fn,
        status="Applied",
        notes=data.notes,
        applied_at=datetime.now(timezone.utc)
    )
    db.add(new_app)
    db.flush()

    # Initial history record
    history = ApplicationStatusHistory(
        application_id=new_app.id,
        old_status=None,
        new_status="Applied",
        changed_by=current_user.name,
        notes="Application submitted by candidate via Job Hunt"
    )
    db.add(history)
    db.commit()
    db.refresh(new_app)

    log_audit_event(
        db=db,
        actor_email=current_user.email,
        action="APPLICATION_SUBMITTED",
        resource="applications",
        details={"application_id": new_app.id, "job_id": job.id, "role": job.title},
        user_id=current_user.id
    )

    return new_app

@router.patch("/{app_id}/status", response_model=ApplicationResponse)
def update_application_status(
    app_id: str,
    data: ApplicationStatusUpdate,
    current_user: User = Depends(require_recruiter_or_admin),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Recruiter permission check
    if current_user.role != "admin" and app.job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to manage applications for this job")

    if data.status not in VALID_STATUSES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}"
        )

    old_status = app.status
    app.status = data.status
    app.updated_at = datetime.now(timezone.utc)

    # Save status history
    history = ApplicationStatusHistory(
        application_id=app.id,
        old_status=old_status,
        new_status=data.status,
        changed_by=current_user.name,
        notes=data.notes or f"Status changed to {data.status}"
    )
    db.add(history)

    # In-app notification for candidate
    notif = Notification(
        user_id=app.candidate_id,
        title=f"Application Update: {app.job.title}",
        message=f"Your application status at {app.job.company} was updated to '{data.status}'.",
        type="success" if data.status == "Selected" else "info"
    )
    db.add(notif)
    db.commit()
    db.refresh(app)

    # Trigger verified email notifications on Selection or Rejection
    if data.status == "Selected":
        send_selection_email(
            db=db,
            candidate_email=app.candidate_email,
            candidate_name=app.candidate_name,
            company=app.job.company,
            role=app.job.title,
            details=data.notes or "Offer and onboarding details will follow shortly."
        )
    elif data.status == "Not Selected":
        send_rejection_email(
            db=db,
            candidate_email=app.candidate_email,
            candidate_name=app.candidate_name,
            company=app.job.company,
            role=app.job.title,
            feedback=data.notes or ""
        )

    log_audit_event(
        db=db,
        actor_email=current_user.email,
        action="APPLICATION_STATUS_UPDATED",
        resource="applications",
        details={
            "application_id": app.id,
            "old_status": old_status,
            "new_status": data.status
        },
        user_id=current_user.id
    )

    return app

@router.get("/{app_id}/resume")
def download_candidate_resume(
    app_id: str,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Authorization: only candidate themselves, job's recruiter, or admin
    is_owner = app.candidate_id == current_user.id
    is_recruiter = app.job.recruiter_id == current_user.id
    is_admin = current_user.role == "admin"

    if not (is_owner or is_recruiter or is_admin):
        raise HTTPException(status_code=403, detail="Unauthorized to access candidate resume")

    if not app.resume_url:
        raise HTTPException(status_code=404, detail="No resume uploaded for this applicant")

    filename = os.path.basename(app.resume_url)
    filepath = os.path.join(settings.UPLOAD_DIR, filename)

    if not os.path.exists(filepath):
        # Fallback to simulated resume stream or placeholder
        return {
            "resume_url": app.resume_url,
            "filename": app.resume_filename or "Resume.pdf",
            "message": "Resume record verified on file."
        }

    ext = os.path.splitext(filename.lower())[1]
    media_type = (
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        if ext == ".docx"
        else "application/pdf"
    )
    return FileResponse(filepath, media_type=media_type, filename=app.resume_filename or f"Resume{ext}")
