import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Job Hunt"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "jobhunt-tamilnadu-secure-jwt-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./jobhunt.db")

    # Predefined System Accounts
    ADMIN_NAME: str = os.getenv("ADMIN_NAME", "Manojkumar")
    ADMIN_EMAIL: str = os.getenv("ADMIN_EMAIL", "manojkumar@jobhunt.com")
    ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "AdminSecure@2026")

    RECRUITER_1_NAME: str = os.getenv("RECRUITER_1_NAME", "Ravikumar")
    RECRUITER_1_EMAIL: str = os.getenv("RECRUITER_1_EMAIL", "ravikumar@jobhunt.com")
    RECRUITER_1_PASSWORD: str = os.getenv("RECRUITER_1_PASSWORD", "Recruiter@Ravi2026")
    RECRUITER_1_COMPANY: str = os.getenv("RECRUITER_1_COMPANY", "Hyundai Motor India")

    RECRUITER_2_NAME: str = os.getenv("RECRUITER_2_NAME", "Divya")
    RECRUITER_2_EMAIL: str = os.getenv("RECRUITER_2_EMAIL", "divya@jobhunt.com")
    RECRUITER_2_PASSWORD: str = os.getenv("RECRUITER_2_PASSWORD", "Recruiter@Divya2026")
    RECRUITER_2_COMPANY: str = os.getenv("RECRUITER_2_COMPANY", "Freshworks Inc")

    # Email
    SMTP_HOST: Optional[str] = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER: Optional[str] = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: Optional[str] = os.getenv("SMTP_PASSWORD", "")
    EMAILS_FROM_EMAIL: str = os.getenv("EMAILS_FROM_EMAIL", "notifications@jobhunt.tn.gov.in")
    EMAILS_FROM_NAME: str = os.getenv("EMAILS_FROM_NAME", "Job Hunt Tamil Nadu")

    # Storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_UPLOAD_SIZE_MB: int = int(os.getenv("MAX_UPLOAD_SIZE_MB", 5))

    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"

settings = Settings()
