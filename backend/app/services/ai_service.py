import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.models.entities import Job, Application

TAMIL_NADU_DISTRICTS_LOWER = [
    "ariyalur", "chengalpattu", "chennai", "coimbatore", "cuddalore",
    "dharmapuri", "dindigul", "erode", "kallakurichi", "kancheepuram",
    "kanyakumari", "karur", "krishnagiri", "madurai", "mayiladuthurai",
    "nagapattinam", "namakkal", "nilgiris", "perambalur", "pudukkottai",
    "ramanathapuram", "ranipet", "salem", "sivaganga", "tenkasi",
    "thanjavur", "theni", "thoothukudi", "tiruchirappalli", "tirunelveli",
    "tirupathur", "tiruppur", "tiruvallur", "tiruvannamalai", "tiruvarur",
    "vellore", "viluppuram", "virudhunagar"
]

def process_ai_career_query(db: Session, prompt: str, user_id: str = None, candidate_profile: Dict[str, Any] = None) -> Dict[str, Any]:
    text = prompt.lower().strip()

    # 1. Check for Status queries
    if any(k in text for k in ["status", "my application", "applied jobs", "where is my application"]):
        apps = []
        if user_id:
            apps = db.query(Application).filter(Application.candidate_id == user_id).all()
        
        if apps:
            summary = "\n".join([f"• {a.job.title if a.job else 'Job'} at {a.job.company if a.job else 'Company'}: Current Status = **{a.status}**" for a in apps])
            return {
                "intent": "status_check",
                "reply": f"Here is the verified status of your current applications on Job Hunt:\n\n{summary}",
                "matched_jobs": [],
                "extracted_filters": {},
                "suggestions": ["Find more jobs in Chennai", "Explore jobs in Coimbatore", "How to prepare for an interview"]
            }
        else:
            return {
                "intent": "status_check",
                "reply": "You currently do not have any active applications recorded in your profile. You can explore available Tamil Nadu openings and submit your application with one click!",
                "matched_jobs": [],
                "extracted_filters": {},
                "suggestions": ["Show Python developer jobs", "Show fresher jobs in Chennai"]
            }

    # 2. Check for Career Guidance Queries
    is_advice = any(k in text for k in [
        "resume", "improve", "interview", "prepare", "project", 
        "missing skill", "which skill", "how to get hired", "guide", "career"
    ])

    if is_advice and not any(k in text for k in ["find", "show me", "search"]):
        if "resume" in text:
            reply = (
                "**Actionable Resume Improvement Checklist for Tamil Nadu Opportunities:**\n\n"
                "1. **Highlight Verified Skills**: Ensure Python, FastAPI, or core technical frameworks are listed near the top.\n"
                "2. **Quantify Achievements**: Instead of 'built backend', state 'developed FastAPI REST APIs reducing latency by 35%'.\n"
                "3. **District & Mobility**: Explicitly state your availability for Chennai (OMR), Coimbatore (Tidel Park/CHIL SEZ), or hybrid work in Tamil Nadu.\n"
                "4. **Format Standard**: Keep your resume as a clean 1-2 page PDF under 5 MB with active GitHub and LinkedIn links."
            )
            return {
                "intent": "career_advice",
                "reply": reply,
                "matched_jobs": [],
                "extracted_filters": {},
                "suggestions": ["Which projects should I build?", "How to prepare for an interview?", "Show Python jobs"]
            }
        elif "interview" in text:
            reply = (
                "**Interview Preparation Strategy:**\n\n"
                "1. **Core Fundamentals**: Master system architecture, REST design, database indexing, and async programming.\n"
                "2. **Tamil Nadu Tech Culture**: Recruiters in Chennai and Coimbatore evaluate practical problem solving and immediate hands-on coding.\n"
                "3. **Scenario Practice**: Be prepared to explain architectural tradeoffs in your projects.\n"
                "4. **Questions for Recruiter**: Prepare insightful questions about engineering culture and development stack."
            )
            return {
                "intent": "career_advice",
                "reply": reply,
                "matched_jobs": [],
                "extracted_filters": {},
                "suggestions": ["Which projects should I build?", "How can I improve my resume?", "Find jobs matching my skills"]
            }
        elif "project" in text:
            reply = (
                "**High-Impact Projects for Your Portfolio:**\n\n"
                "1. **Tamil Nadu Agritech Supply Chain API**: Built with FastAPI, PostgreSQL, and background worker queues.\n"
                "2. **Real-time IoT Telemetry Engine**: Utilizing WebSockets and Python for automotive sensor monitoring (highly valued by Hyundai & EV OEMs).\n"
                "3. **SaaS Multi-tenant Billing Platform**: Incorporating Stripe/Razorpay webhook processing and role-based permissions."
            )
            return {
                "intent": "career_advice",
                "reply": reply,
                "matched_jobs": [],
                "extracted_filters": {},
                "suggestions": ["How can I improve my resume?", "Show Python developer jobs in Chennai"]
            }

    # 3. Job Search Query — Extract Real Filters and Query Database
    extracted = {
        "district": None,
        "keywords": [],
        "is_fresher": False,
        "work_mode": None
    }

    # Detect District
    for district in TAMIL_NADU_DISTRICTS_LOWER:
        if district in text:
            extracted["district"] = district.capitalize()
            break

    # Detect Fresher
    if any(k in text for k in ["fresher", "freshers", "entry level", "0 years", "graduate"]):
        extracted["is_fresher"] = True

    # Detect Work Mode
    if "remote" in text:
        extracted["work_mode"] = "Remote"
    elif "hybrid" in text:
        extracted["work_mode"] = "Hybrid"
    elif "on-site" in text or "onsite" in text:
        extracted["work_mode"] = "On-site"

    # Detect Skills/Keywords
    common_keywords = ["python", "fastapi", "embedded", "ev", "automotive", "textile", "react", "sql", "pytorch", "ai", "cloud"]
    for kw in common_keywords:
        if kw in text:
            extracted["keywords"].append(kw)

    # Query Real Database
    query = db.query(Job).filter(Job.status == "Active")

    if extracted["district"]:
        query = query.filter(Job.district.ilike(f"%{extracted['district']}%"))

    if extracted["work_mode"]:
        query = query.filter(Job.work_mode == extracted["work_mode"])

    if extracted["is_fresher"]:
        query = query.filter(Job.experience.ilike("%fresher%") | Job.experience.ilike("%0-%"))

    # Apply keyword filter
    if extracted["keywords"]:
        filters = []
        for kw in extracted["keywords"]:
            filters.append(Job.title.ilike(f"%{kw}%"))
            filters.append(Job.description.ilike(f"%{kw}%"))
        query = query.filter(or_(*filters))

    matched_jobs = query.limit(10).all()

    # If too narrow, fallback to all active jobs
    if not matched_jobs and (extracted["district"] or extracted["keywords"]):
        matched_jobs = db.query(Job).filter(Job.status == "Active").limit(6).all()
        reply = (
            f"I searched for opportunities matching '{prompt}'. While no exact direct listings matched all filters, "
            f"here are {len(matched_jobs)} active verified opportunities across Tamil Nadu:"
        )
    else:
        location_desc = f"in {extracted['district']}" if extracted['district'] else "across Tamil Nadu"
        reply = f"Found {len(matched_jobs)} verified job opening(s) {location_desc} matching your search."

    return {
        "intent": "job_search",
        "reply": reply,
        "matched_jobs": matched_jobs,
        "extracted_filters": extracted,
        "suggestions": [
            "Find Python developer jobs in Chennai",
            "Find fresher jobs in Coimbatore",
            "Show my application status",
            "How can I improve my resume?"
        ]
    }
