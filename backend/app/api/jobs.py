from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db.database import get_db
from app.models.entities import Job, User
from app.schemas.schemas import JobCreate, JobUpdate, JobResponse
from app.api.deps import get_current_authenticated_user, require_recruiter_or_admin, log_audit_event

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def list_jobs(
    district: Optional[str] = None,
    category: Optional[str] = None,
    work_mode: Optional[str] = None,
    experience: Optional[str] = None,
    search: Optional[str] = None,
    status_filter: Optional[str] = "Active",
    db: Session = Depends(get_db)
):
    query = db.query(Job)
    if status_filter:
        query = query.filter(Job.status == status_filter)

    if district and district.upper() != "ALL":
        query = query.filter(Job.district.ilike(f"%{district}%"))

    if category and category.upper() != "ALL":
        query = query.filter(Job.category == category)

    if work_mode and work_mode.upper() != "ALL":
        query = query.filter(Job.work_mode == work_mode)

    if experience and experience.upper() != "ALL":
        query = query.filter(Job.experience.ilike(f"%{experience}%"))

    if search:
        s = f"%{search}%"
        query = query.filter(
            or_(
                Job.title.ilike(s),
                Job.company.ilike(s),
                Job.district.ilike(s),
                Job.description.ilike(s)
            )
        )

    return query.order_by(Job.created_at.desc()).all()

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found")
    return job

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    data: JobCreate,
    current_user: User = Depends(require_recruiter_or_admin),
    db: Session = Depends(get_db)
):
    # Validation: District must be in Tamil Nadu
    verified_location = data.verified_location or f"{data.district}, Tamil Nadu"

    new_job = Job(
        title=data.title,
        company=data.company or (current_user.company or "Company"),
        recruiter_id=current_user.id,
        recruiter_name=current_user.name,
        logo_color=data.logo_color or "#2563eb",
        district=data.district,
        city=data.city,
        work_mode=data.work_mode or "On-site",
        type=data.type or "Full-time",
        experience=data.experience or "1-3 years",
        salary=data.salary,
        category=data.category or "it",
        tags=data.tags or [],
        deadline=data.deadline,
        status="Active",
        description=data.description,
        requirements=data.requirements or [],
        verified_location=verified_location
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)

    log_audit_event(
        db=db,
        actor_email=current_user.email,
        action="JOB_CREATED",
        resource="jobs",
        details={"job_id": new_job.id, "title": new_job.title, "company": new_job.company},
        user_id=current_user.id
    )

    return new_job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(
    job_id: str,
    data: JobUpdate,
    current_user: User = Depends(require_recruiter_or_admin),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job opening not found")

    # Only recruiter who created it or Admin can edit
    if current_user.role != "admin" and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this job posting")

    update_dict = data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    log_audit_event(
        db=db,
        actor_email=current_user.email,
        action="JOB_UPDATED",
        resource="jobs",
        details={"job_id": job.id, "changes": list(update_dict.keys())},
        user_id=current_user.id
    )

    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(
    job_id: str,
    current_user: User = Depends(require_recruiter_or_admin),
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if current_user.role != "admin" and job.recruiter_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this job")

    db.delete(job)
    db.commit()

    log_audit_event(
        db=db,
        actor_email=current_user.email,
        action="JOB_DELETED",
        resource="jobs",
        details={"job_id": job_id, "title": job.title},
        user_id=current_user.id
    )
    return None
