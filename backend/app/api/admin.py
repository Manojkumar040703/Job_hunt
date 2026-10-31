from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import (
    User,
    RecruiterProfile,
    Job,
    Application,
    Interview,
    EmailDeliveryRecord,
    AuditLog
)
from app.schemas.schemas import (
    UserResponse,
    RecruiterCreateByAdmin,
    EmailLogResponse
)
from app.api.deps import require_admin, log_audit_event
from app.core.security import get_password_hash

router = APIRouter(prefix="/admin", tags=["Admin Console (Manojkumar)"])

@router.get("/stats")
def get_platform_stats(
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    total_candidates = db.query(User).filter(User.role == "candidate").count()
    total_recruiters = db.query(User).filter(User.role == "recruiter").count()
    active_jobs = db.query(Job).filter(Job.status == "Active").count()
    total_applications = db.query(Application).count()
    selected_count = db.query(Application).filter(Application.status == "Selected").count()
    scheduled_interviews = db.query(Interview).count()
    emails_sent = db.query(EmailDeliveryRecord).count()

    return {
        "total_users": total_users,
        "total_candidates": total_candidates,
        "total_recruiters": total_recruiters,
        "active_jobs": active_jobs,
        "total_applications": total_applications,
        "selected_candidates": selected_count,
        "scheduled_interviews": scheduled_interviews,
        "emails_dispatched": emails_sent,
        "admin_name": current_admin.name,
        "platform": "Job Hunt — Tamil Nadu"
    }

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    role: str = None,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.created_at.desc()).all()

@router.post("/recruiters", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_recruiter_account(
    data: RecruiterCreateByAdmin,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    email = data.email.strip().lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists")

    new_recruiter = User(
        email=email,
        hashed_password=get_password_hash(data.password),
        name=data.name.strip(),
        role="recruiter",
        company=data.company.strip(),
        district=data.district or "Chennai",
        title=data.title or "Talent Acquisition Specialist",
        is_active=True
    )
    db.add(new_recruiter)
    db.flush()

    recruiter_profile = RecruiterProfile(
        user_id=new_recruiter.id,
        company=data.company.strip(),
        verified_district=data.district or "Chennai",
        designation=data.title,
        can_post_jobs=True
    )
    db.add(recruiter_profile)
    db.commit()
    db.refresh(new_recruiter)

    log_audit_event(
        db=db,
        actor_email=current_admin.email,
        action="RECRUITER_CREATED",
        resource="users",
        details={"created_email": new_recruiter.email, "company": data.company},
        user_id=current_admin.id
    )

    return new_recruiter

@router.patch("/users/{user_id}/toggle-status", response_model=UserResponse)
def toggle_user_status(
    user_id: str,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="Cannot deactivate the primary administrator account")

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

    action_name = "ACCOUNT_ACTIVATED" if user.is_active else "ACCOUNT_DEACTIVATED"
    log_audit_event(
        db=db,
        actor_email=current_admin.email,
        action=action_name,
        resource="users",
        details={"target_email": user.email, "is_active": user.is_active},
        user_id=current_admin.id
    )

    return user

@router.get("/email-logs", response_model=List[EmailLogResponse])
def get_email_delivery_logs(
    limit: int = 50,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return db.query(EmailDeliveryRecord).order_by(EmailDeliveryRecord.sent_at.desc()).limit(limit).all()

@router.get("/audit-logs")
def get_system_audit_logs(
    limit: int = 50,
    current_admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(limit).all()
    return logs
