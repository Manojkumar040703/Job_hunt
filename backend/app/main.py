import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.db.database import engine, Base
from app.api.auth import router as auth_router
from app.api.jobs import router as jobs_router
from app.api.candidates import router as candidates_router
from app.api.applications import router as applications_router
from app.api.interviews import router as interviews_router
from app.api.admin import router as admin_router
from app.api.ai import router as ai_router
from app.api.notifications import router as notifications_router
from app.api.recruiters import router as recruiters_router
from app.api.courses import router as courses_router
from app.api.payments import router as payments_router
from app.api.community import router as community_router
from app.api.messages import router as messages_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title="Job Hunt API — Tamil Nadu Career Platform",
    description="Professional backend for Job Hunt with verified Tamil Nadu jobs, real candidate applications, downloadable resumes, and email dispatch.",
    version="2.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded candidate resumes and photos
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include API Routers under /api
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(candidates_router, prefix=settings.API_V1_STR)
app.include_router(applications_router, prefix=settings.API_V1_STR)
app.include_router(interviews_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(recruiters_router, prefix=settings.API_V1_STR)
app.include_router(courses_router, prefix=settings.API_V1_STR)
app.include_router(payments_router, prefix=settings.API_V1_STR)
app.include_router(community_router, prefix=settings.API_V1_STR)
app.include_router(messages_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # Automatically execute seed script to verify the 3 accounts exist
    from seed import seed_database
    seed_database()

@app.get("/", tags=["System Health"])
def root():
    return {
        "platform": "Job Hunt - Tamil Nadu Career & Recruitment Platform",
        "tagline": "Connecting talent across all 38 districts of Tamil Nadu",
        "status": "operational",
        "environment": "production",
        "version": "2.0.0",
        "documentation": {
            "swagger_ui": "/docs",
            "redoc": "/redoc",
            "openapi_json": "/openapi.json"
        },
        "api_v1": settings.API_V1_STR,
        "districts_supported": 38,
        "preconfigured_roles": [
            {
                "role": "admin",
                "name": "Manoj",
                "email": "manoj@demo.com",
                "description": "Platform Administrator overseeing governance, audit logs, and verified employers"
            },
            {
                "role": "recruiter",
                "name": "Raj",
                "email": "raj@demo.com",
                "company": "Apex Mobility",
                "description": "Recruiter managing Tamil Nadu job openings, applicant shortlisting, and interviews"
            },
            {
                "role": "candidate",
                "name": "Hari",
                "email": "hari@demo.com",
                "description": "Job Seeker applying for jobs, uploading resumes, and tracking applications"
            }
        ],
        "core_capabilities": [
            "Role-Based Access Control (RBAC)",
            "AI Voice Career Assistant (Tamil & English)",
            "PDF & DOCX Resume Validation & Management",
            "IIT Madras & State Accredited Courses",
            "Direct UPI Payment Gateway Verification",
            "Real-Time Application Status Pipeline",
            "Automated Email Invitation & Interview Scheduling",
            "Professional Community Feed & Direct Messaging"
        ]
    }
