from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime

# Auth & User Schemas
class UserLogin(BaseModel):
    email: str
    password: str

class CandidateRegister(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    name: str
    phone: Optional[str] = None
    district: Optional[str] = "Chennai"

class RecruiterCreateByAdmin(BaseModel):
    email: str
    password: str = Field(..., min_length=6)
    name: str
    company: str
    district: Optional[str] = "Chennai"
    title: Optional[str] = "Talent Acquisition Specialist"

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    company: Optional[str] = None
    title: Optional[str] = None
    district: Optional[str] = None
    phone: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Candidate Profile
class CandidateProfileUpdate(BaseModel):
    career_objective: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[List[str]] = None
    experience_summary: Optional[str] = None
    internships: Optional[str] = None
    projects: Optional[str] = None
    preferred_roles: Optional[List[str]] = None
    preferred_districts: Optional[List[str]] = None

class CandidateProfileResponse(BaseModel):
    id: str
    user_id: str
    career_objective: Optional[str] = None
    education: Optional[str] = None
    skills: List[str] = []
    experience_summary: Optional[str] = None
    internships: Optional[str] = None
    projects: Optional[str] = None
    resume_url: Optional[str] = None
    resume_filename: Optional[str] = None
    preferred_roles: List[str] = []
    preferred_districts: List[str] = []
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True

# Job Schemas
class JobCreate(BaseModel):
    title: str
    company: str
    district: str
    city: Optional[str] = None
    work_mode: Optional[str] = "On-site"
    type: Optional[str] = "Full-time"
    experience: Optional[str] = "1-3 years"
    salary: Optional[str] = "₹6,00,000 - ₹10,00,000 PA"
    category: Optional[str] = "it"
    tags: Optional[List[str]] = []
    deadline: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = []
    verified_location: Optional[str] = None
    logo_color: Optional[str] = "#2563eb"

class JobUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    work_mode: Optional[str] = None
    type: Optional[str] = None
    experience: Optional[str] = None
    salary: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    deadline: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None

class JobResponse(BaseModel):
    id: str
    title: str
    company: str
    recruiter_id: Optional[str] = None
    recruiter_name: Optional[str] = None
    logo_color: Optional[str] = "#2563eb"
    district: str
    city: Optional[str] = None
    work_mode: str
    type: str
    experience: str
    salary: Optional[str] = None
    category: str
    tags: List[str] = []
    deadline: Optional[str] = None
    status: str
    description: Optional[str] = None
    requirements: List[str] = []
    verified_location: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Application Schemas
class ApplicationCreate(BaseModel):
    job_id: str
    notes: Optional[str] = None

class ApplicationStatusUpdate(BaseModel):
    status: str # "Applied", "Under Review", "Shortlisted", "Interview Scheduled", "Selected", "Not Selected"
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: str
    job_id: str
    candidate_id: str
    candidate_name: str
    candidate_email: str
    candidate_phone: Optional[str] = None
    resume_url: Optional[str] = None
    resume_filename: Optional[str] = None
    status: str
    notes: Optional[str] = None
    applied_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    job: Optional[JobResponse] = None

    class Config:
        from_attributes = True

# Interview Schemas
class InterviewCreate(BaseModel):
    application_id: str
    round_name: str
    date: str
    time: str
    interviewers: Optional[str] = None
    mode: Optional[str] = "Online Video Meeting"
    meet_url: Optional[str] = None
    instructions: Optional[str] = None

class InterviewResponse(BaseModel):
    id: str
    application_id: str
    job_id: str
    candidate_id: str
    candidate_name: str
    recruiter_id: str
    company: str
    role: str
    round_name: str
    date: str
    time: str
    interviewers: Optional[str] = None
    mode: str
    meet_url: Optional[str] = None
    instructions: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# AI Career Assistant
class AIQueryRequest(BaseModel):
    prompt: str
    candidate_profile: Optional[Dict[str, Any]] = None

class AIQueryResponse(BaseModel):
    intent: str # "job_search", "career_advice", "status_check", "skill_gap"
    reply: str
    matched_jobs: List[JobResponse] = []
    extracted_filters: Dict[str, Any] = {}
    suggestions: List[str] = []

# Audit & Email records
class EmailLogResponse(BaseModel):
    id: str
    recipient_email: str
    recipient_name: Optional[str] = None
    subject: str
    template_type: str
    status: str
    sent_at: datetime

    class Config:
        from_attributes = True
