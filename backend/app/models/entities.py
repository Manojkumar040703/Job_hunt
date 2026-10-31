import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Integer,
    JSON,
)
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="candidate", index=True) # "admin", "recruiter", "candidate"
    company = Column(String, nullable=True)
    title = Column(String, nullable=True)
    district = Column(String, default="Chennai")
    phone = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    recruiter_profile = relationship("RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="candidate", cascade="all, delete-orphan")
    posted_jobs = relationship("Job", back_populates="recruiter", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    career_objective = Column(Text, nullable=True)
    education = Column(Text, nullable=True)
    skills = Column(JSON, default=list)
    experience_summary = Column(Text, nullable=True)
    internships = Column(Text, nullable=True)
    projects = Column(Text, nullable=True)
    resume_url = Column(String, nullable=True)
    resume_filename = Column(String, nullable=True)
    preferred_roles = Column(JSON, default=list)
    preferred_districts = Column(JSON, default=list)

    user = relationship("User", back_populates="candidate_profile")

class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    company = Column(String, nullable=False)
    company_logo_color = Column(String, default="#002c6c")
    verified_district = Column(String, default="Chennai")
    designation = Column(String, nullable=True)
    can_post_jobs = Column(Boolean, default=True)

    user = relationship("User", back_populates="recruiter_profile")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False, index=True)
    recruiter_id = Column(String, ForeignKey("users.id"), nullable=True)
    recruiter_name = Column(String, nullable=True)
    logo_color = Column(String, default="#2563eb")
    district = Column(String, nullable=False, index=True) # Tamil Nadu District
    city = Column(String, nullable=True)
    work_mode = Column(String, default="On-site") # On-site, Hybrid, Remote
    type = Column(String, default="Full-time") # Full-time, Internship, Contract
    experience = Column(String, default="1-3 years")
    salary = Column(String, nullable=True)
    category = Column(String, default="it", index=True)
    tags = Column(JSON, default=list)
    deadline = Column(String, nullable=True)
    status = Column(String, default="Active", index=True) # Active, Paused, Closed
    description = Column(Text, nullable=True)
    requirements = Column(JSON, default=list)
    verified_location = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    recruiter = relationship("User", back_populates="posted_jobs")
    applications = relationship("Application", back_populates="job", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="job", cascade="all, delete-orphan")

class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False, index=True)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    candidate_name = Column(String, nullable=False)
    candidate_email = Column(String, nullable=False)
    candidate_phone = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    resume_filename = Column(String, nullable=True)
    # Valid Statuses: Applied, Under Review, Shortlisted, Interview Scheduled, Selected, Not Selected
    status = Column(String, default="Applied", index=True)
    notes = Column(Text, nullable=True)
    applied_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    candidate = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", cascade="all, delete-orphan")
    interviews = relationship("Interview", back_populates="application", cascade="all, delete-orphan")

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False, index=True)
    old_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    changed_by = Column(String, nullable=False) # Name or email
    notes = Column(Text, nullable=True)
    changed_at = Column(DateTime, default=utc_now)

    application = relationship("Application", back_populates="status_history")

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=generate_uuid)
    application_id = Column(String, ForeignKey("applications.id"), nullable=False)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    candidate_id = Column(String, ForeignKey("users.id"), nullable=False)
    candidate_name = Column(String, nullable=False)
    recruiter_id = Column(String, nullable=False)
    company = Column(String, nullable=False)
    role = Column(String, nullable=False)
    round_name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    interviewers = Column(String, nullable=True)
    mode = Column(String, default="Online Video Meeting")
    meet_url = Column(String, nullable=True)
    instructions = Column(Text, nullable=True)
    status = Column(String, default="Scheduled") # Scheduled, Completed, Cancelled
    created_at = Column(DateTime, default=utc_now)

    application = relationship("Application", back_populates="interviews")
    job = relationship("Job", back_populates="interviews")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String, default="info") # info, success, warning, alert
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="notifications")

class EmailDeliveryRecord(Base):
    __tablename__ = "email_delivery_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    recipient_email = Column(String, nullable=False)
    recipient_name = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    template_type = Column(String, nullable=False) # "selection", "rejection", "interview", "notification"
    status = Column(String, default="Sent") # "Sent", "Failed", "Simulated"
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime, default=utc_now)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=True)
    actor_email = Column(String, nullable=False)
    action = Column(String, nullable=False) # e.g. "USER_LOGIN", "RECRUITER_CREATED", "STATUS_UPDATED", "JOB_APPROVED"
    resource = Column(String, nullable=False)
    details = Column(JSON, default=dict)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)

class Course(Base):
    __tablename__ = "courses"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False, index=True)
    provider = Column(String, nullable=False)
    instructor = Column(String, nullable=True)
    category = Column(String, default="it", index=True)
    level = Column(String, default="Intermediate")
    duration = Column(String, default="6 Weeks")
    mode = Column(String, default="Online") # Online, Hybrid, Classroom
    district = Column(String, default="Chennai")
    price = Column(Integer, default=0) # 0 = Free
    has_certificate = Column(Boolean, default=True)
    certificate_issuer = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    syllabus = Column(JSON, default=list)
    prerequisites = Column(JSON, default=list)
    rating = Column(String, default="4.8")
    reviews_count = Column(Integer, default=120)
    created_at = Column(DateTime, default=utc_now)

class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(String, primary_key=True, default=generate_uuid)
    course_id = Column(String, ForeignKey("courses.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    payment_id = Column(String, nullable=True)
    amount_paid = Column(Integer, default=0)
    payment_status = Column(String, default="SUCCESS")
    enrolled_at = Column(DateTime, default=utc_now)

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    course_id = Column(String, nullable=True)
    amount = Column(Integer, nullable=False) # In INR rupees
    currency = Column(String, default="INR")
    payment_method = Column(String, default="UPI") # UPI, Google Pay, Paytm, Card
    upi_ref = Column(String, nullable=True)
    status = Column(String, default="SUCCESS", index=True) # SUCCESS, PENDING, FAILED, REFUNDED
    receipt_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utc_now)

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(String, primary_key=True, default=generate_uuid)
    author_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    author_name = Column(String, nullable=False)
    author_role = Column(String, default="Member")
    author_company = Column(String, nullable=True)
    author_avatar = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    image_url = Column(String, nullable=True)
    category = Column(String, default="career")
    district = Column(String, default="Chennai")
    likes_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

class PostComment(Base):
    __tablename__ = "post_comments"

    id = Column(String, primary_key=True, default=generate_uuid)
    post_id = Column(String, ForeignKey("community_posts.id"), nullable=False, index=True)
    author_id = Column(String, ForeignKey("users.id"), nullable=False)
    author_name = Column(String, nullable=False)
    author_avatar = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=utc_now)

class DirectMessage(Base):
    __tablename__ = "direct_messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    sender_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    sender_name = Column(String, nullable=False)
    receiver_name = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    attachment_url = Column(String, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

