import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.config import settings
from app.core.security import get_password_hash
from app.db.database import SessionLocal, engine, Base
from app.models.entities import User, RecruiterProfile, Job, CandidateProfile, Course

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("[Job Hunt Seed] Checking system accounts...")

        # 1. Manojkumar / Manoj — Admin
        admin = db.query(User).filter((User.email == settings.ADMIN_EMAIL) | (User.email == "manoj@demo.com")).first()
        if not admin:
            admin = User(
                id="user-manoj",
                email="manoj@demo.com",
                hashed_password=get_password_hash("AdminSecure@2026"),
                name="Manoj",
                role="admin",
                company="Job Hunt Platform",
                title="Platform Administrator",
                district="Chennai",
                phone="+91 98401 23456",
                is_active=True
            )
            db.add(admin)
            print("[Job Hunt Seed] Created Admin: Manoj (manoj@demo.com)")

        # 2. Raj — Recruiter (Apex Mobility)
        recruiter_raj = db.query(User).filter((User.email == "raj@demo.com") | (User.email == settings.RECRUITER_1_EMAIL)).first()
        if not recruiter_raj:
            recruiter_raj = User(
                id="user-raj",
                email="raj@demo.com",
                hashed_password=get_password_hash("Recruiter@Raj2026"),
                name="Raj",
                role="recruiter",
                company="Apex Mobility",
                title="Talent Acquisition Lead",
                district="Kancheepuram",
                phone="+91 94441 87654",
                is_active=True
            )
            db.add(recruiter_raj)
            db.flush()

            profile_raj = RecruiterProfile(
                user_id=recruiter_raj.id,
                company="Apex Mobility",
                company_logo_color="#002c6c",
                verified_district="Kancheepuram",
                designation="Talent Acquisition Lead",
                can_post_jobs=True
            )
            db.add(profile_raj)
            print("[Job Hunt Seed] Created Recruiter: Raj (raj@demo.com)")

        # 3. Hari — Job Seeker (Candidate)
        candidate_hari = db.query(User).filter(User.email == "hari@demo.com").first()
        if not candidate_hari:
            candidate_hari = User(
                id="user-hari",
                email="hari@demo.com",
                hashed_password=get_password_hash("Candidate@Hari2026"),
                name="Hari",
                role="candidate",
                company="Candidate",
                title="Full Stack Python/React Developer",
                district="Coimbatore",
                phone="+91 97890 12345",
                is_active=True
            )
            db.add(candidate_hari)
            db.flush()

            profile_hari = CandidateProfile(
                user_id=candidate_hari.id,
                career_objective="Passionate full-stack developer building scalable FastAPI and React applications in Tamil Nadu.",
                education="B.E. Computer Science — Government College of Technology, Coimbatore",
                skills=["Python", "FastAPI", "React", "PostgreSQL", "Docker", "REST APIs", "CSS", "Git"],
                experience_summary="3 years of software engineering building modern web products.",
                preferred_roles=["Senior Full Stack Developer", "Backend Engineer", "Python Developer"],
                preferred_districts=["Coimbatore", "Chennai"]
            )
            db.add(profile_hari)
            print("[Job Hunt Seed] Created Job Seeker: Hari (hari@demo.com)")

        db.commit()

        # Seed Verified Tamil Nadu Initial Jobs for Ravikumar and Divya
        existing_jobs = db.query(Job).count()
        if existing_jobs == 0:
            print("[Job Hunt Seed] Seeding verified Tamil Nadu job listings...")
            initial_jobs = [
                Job(
                    id="job-101",
                    title="Senior Full Stack Python/FastAPI Developer",
                    company="Apex Mobility",
                    recruiter_id="user-raj",
                    recruiter_name="Raj",
                    logo_color="#002c6c",
                    district="Chennai",
                    city="Perungudi (OMR)",
                    work_mode="Hybrid",
                    type="Full-time",
                    experience="3-6 years",
                    salary="₹18,00,000 - ₹26,00,000 PA",
                    category="it",
                    tags=["Python", "FastAPI", "React", "PostgreSQL", "Docker", "AWS"],
                    deadline="2026-11-25",
                    status="Active",
                    description="Architect high-throughput REST APIs and real-time distributed microservices powering telemetry and AI workflows across EV fleets.",
                    requirements=[
                        "3+ years of professional backend development with Python, FastAPI, or Django.",
                        "Experience designing relational schemas with PostgreSQL and SQLAlchemy.",
                        "Familiarity with containerized deployments (Docker/Kubernetes) on AWS."
                    ],
                    verified_location="OMR IT Corridor, Chennai, Tamil Nadu"
                ),
                Job(
                    id="job-102",
                    title="Automotive Embedded Firmware Engineer",
                    company="Apex Mobility",
                    recruiter_id="user-raj",
                    recruiter_name="Raj",
                    logo_color="#002c6c",
                    district="Kancheepuram",
                    city="Sriperumbudur",
                    work_mode="On-site",
                    type="Full-time",
                    experience="2-5 years",
                    salary="₹10,50,000 - ₹15,50,000 PA",
                    category="auto",
                    tags=["Embedded C", "CAN Protocol", "AUTOSAR", "ARM Cortex", "Microcontrollers"],
                    deadline="2026-12-10",
                    status="Active",
                    description="Develop safety-critical electronic control unit (ECU) firmware, CAN bus communications, and diagnostics for next-generation electric and connected vehicle platforms.",
                    requirements=[
                        "Proficiency in Embedded C programming and microcontroller debugging (ARM Cortex / Infineon TriCore).",
                        "Experience with vehicle networking protocols: CAN, LIN, and diagnostic services (UDS / ISO 14229).",
                        "Degree in Electronics, Electrical, or Automobile Engineering."
                    ],
                    verified_location="Apex Mobility Plant, Sriperumbudur, Tamil Nadu"
                ),
                Job(
                    id="job-103",
                    title="Junior Python Engineer (Fresher Friendly)",
                    company="Apex Mobility",
                    recruiter_id="user-raj",
                    recruiter_name="Raj",
                    logo_color="#002c6c",
                    district="Coimbatore",
                    city="Saravanampatti",
                    work_mode="Hybrid",
                    type="Full-time",
                    experience="Fresher (0-1 year)",
                    salary="₹5,00,000 - ₹7,00,000 PA",
                    category="it",
                    tags=["Python", "FastAPI", "SQL", "Git", "Fresher Friendly"],
                    deadline="2026-12-05",
                    status="Active",
                    description="Launch your career with intensive mentorship in SaaS development, FastAPI backend services, and automated testing.",
                    requirements=[
                        "2024, 2025, or 2026 graduate from any Tamil Nadu college.",
                        "Demonstrated coding proficiency in Python and basic SQL."
                    ],
                    verified_location="CHIL SEZ, Saravanampatti, Coimbatore, Tamil Nadu"
                ),
                Job(
                    id="job-104",
                    title="EV Powertrain Quality & Test Specialist",
                    company="Apex Mobility",
                    recruiter_id="user-raj",
                    recruiter_name="Raj",
                    logo_color="#002c6c",
                    district="Kancheepuram",
                    city="Sriperumbudur",
                    work_mode="On-site",
                    type="Full-time",
                    experience="3-7 years",
                    salary="₹11,00,000 - ₹16,00,000 PA",
                    category="auto",
                    tags=["EV Powertrain", "High Voltage", "Testing", "ISO 26262", "Quality"],
                    deadline="2026-11-30",
                    status="Active",
                    description="Lead Hardware-in-the-Loop (HIL) testing and quality verification for electric vehicle battery packs and motor inverters.",
                    requirements=[
                        "B.E/B.Tech in Electrical, Electronics, or Mechanical Engineering.",
                        "3+ years testing automotive powertrains or high voltage electronic systems."
                    ],
                    verified_location="Sriperumbudur Industrial Zone, Tamil Nadu"
                )
            ]
            for j in initial_jobs:
                db.add(j)
            db.commit()
            print(f"[Job Hunt Seed] Successfully seeded {len(initial_jobs)} verified Tamil Nadu jobs.")

        # Seed Verified Tamil Nadu Courses
        existing_courses = db.query(Course).count()
        if existing_courses == 0:
            courses = [
                Course(
                    id="course-1",
                    title="Full Stack Python, FastAPI & Modern React Mastery",
                    provider="IIT Madras Pravartak & Job Hunt",
                    instructor="Dr. S. Ranganathan (IITM Pravartak)",
                    category="it",
                    level="Intermediate",
                    duration="8 Weeks",
                    mode="Online",
                    district="Chennai",
                    price=0,
                    has_certificate=True,
                    certificate_issuer="IIT Madras Pravartak",
                    rating="4.9",
                    reviews_count=230,
                    syllabus=["FastAPI Async Architecture", "SQLAlchemy 2.0 & PostgreSQL", "React SPA & State", "Vite & Production Deployment"],
                    prerequisites=["Basic Python & JavaScript", "Familiarity with web concepts"]
                ),
                Course(
                    id="course-2",
                    title="Electric Vehicle (EV) Powertrain & Battery Management Systems",
                    provider="Anna University & Tamil Nadu Skill Dev (TNSDC)",
                    instructor="Prof. M. Vijayalakshmi",
                    category="auto",
                    level="Advanced",
                    duration="10 Weeks",
                    mode="Hybrid",
                    district="Kancheepuram",
                    price=2499,
                    has_certificate=True,
                    certificate_issuer="Anna University Centre for Automotive Research",
                    rating="4.8",
                    reviews_count=180,
                    syllabus=["EV Battery Chemistry & Thermal Dynamics", "BMS Firmware & CAN Bus", "Motor Inverters & Regenerative Braking", "ISO 26262 Automotive Safety"],
                    prerequisites=["B.E/Diploma in Electrical, Electronics, or Mechanical"]
                ),
                Course(
                    id="course-3",
                    title="Naan Mudhalvan: Data Analytics & SQL for Tamil Nadu Industries",
                    provider="Naan Mudhalvan — Govt of Tamil Nadu",
                    instructor="Industry Mentors Cohort",
                    category="it",
                    level="Beginner to Intermediate",
                    duration="6 Weeks",
                    mode="Online",
                    district="Coimbatore",
                    price=0,
                    has_certificate=True,
                    certificate_issuer="Government of Tamil Nadu Naan Mudhalvan",
                    rating="4.9",
                    reviews_count=410,
                    syllabus=["SQL Queries & Joins", "PostgreSQL Administration", "Business Intelligence & PowerBI", "Career Interview Preparation"],
                    prerequisites=["No prior coding required; open to all graduates"]
                )
            ]
            for c in courses:
                db.add(c)
            db.commit()
            print(f"[Job Hunt Seed] Successfully seeded {len(courses)} accredited Tamil Nadu courses.")

        print("[Job Hunt Seed] Completed successfully.")
    except Exception as e:
        db.rollback()
        print(f"[Job Hunt Seed Error] {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
