from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.entities import Course, CourseEnrollment, User
from app.api.deps import get_current_authenticated_user

router = APIRouter(prefix="/courses", tags=["Courses & Learning"])

class CourseResponse(BaseModel):
    id: str
    title: str
    provider: str
    instructor: Optional[str] = None
    category: str
    level: str
    duration: str
    mode: str
    district: str
    price: int
    has_certificate: bool
    certificate_issuer: Optional[str] = None
    thumbnail_url: Optional[str] = None
    rating: str
    reviews_count: int

    class Config:
        from_attributes = True

class EnrollRequest(BaseModel):
    payment_id: Optional[str] = None
    amount_paid: Optional[int] = 0

@router.get("", response_model=List[CourseResponse])
def get_courses(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Course)
    if category and category.lower() != "all":
        query = query.filter(Course.category == category)
    return query.all()

@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@router.post("/{course_id}/enroll")
def enroll_course(
    course_id: str,
    data: EnrollRequest,
    current_user: User = Depends(get_current_authenticated_user),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = (
        db.query(CourseEnrollment)
        .filter(CourseEnrollment.course_id == course_id, CourseEnrollment.user_id == current_user.id)
        .first()
    )
    if existing:
        return {"message": "Already enrolled in this course", "enrollment_id": existing.id}

    enrollment = CourseEnrollment(
        course_id=course_id,
        user_id=current_user.id,
        payment_id=data.payment_id or "FREE-ENROLL",
        amount_paid=data.amount_paid or course.price,
        payment_status="SUCCESS"
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)

    return {
        "message": "Enrollment confirmed successfully",
        "enrollment_id": enrollment.id,
        "course": course.title
    }
