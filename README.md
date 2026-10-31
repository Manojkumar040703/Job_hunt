# Job Hunt — Mobile-First Career & Recruitment Platform

**Job Hunt** is a modern, mobile-friendly job search and talent acquisition platform built exclusively for opportunities across all 38 districts of **Tamil Nadu, India**. It brings together job seekers, authorized recruiters, and administrators with AI-powered voice search, real-time status tracking, verified email dispatch, and role-based security.

---

## 1. System Personas & Predefined Accounts

The application operates with strictly **three predefined initial system accounts**. No public user can self-elevate to an admin or recruiter. Public registration is open exclusively to genuine job seekers as **Candidate**.

| Persona | Name | Registered Email | Initial Role | Company / Scope |
|---|---|---|---|---|
| **Administrator** | **Manojkumar** | `manojkumar@jobhunt.com` | `admin` | Full statewide console, recruiter management, audit & email logs |
| **Lead Recruiter** | **Ravikumar** | `ravikumar@jobhunt.com` | `recruiter` | **Hyundai Motor India** (Sriperumbudur / Kancheepuram) |
| **Technical Recruiter** | **Divya** | `divya@jobhunt.com` | `recruiter` | **Freshworks Inc** (Perungudi OMR / Chennai) |

- **Candidates**: Any job seeker can register via the public registration screen (`role: "candidate"`).
- **Recruiter Provisioning**: Only Manojkumar (Admin) can create, activate, or deactivate recruiter accounts.

---

## 2. Core Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Vanilla CSS Design System with dark/light theme support, glassmorphism, micro-animations, and responsive tokens.
- **Mobile Experience**: Fixed native-style bottom navigation bar (`MobileBottomNav.jsx`), touch-optimized cards, and PWA manifest (`manifest.json`).
- **AI Voice Recognition**: Native Web Speech API with micro-phone permission check, interim/final accumulator preventing duplication, English & Tamil (`ta-IN`, `en-IN`) support, editable query box, and speech-synthesis audio output with instant stop.

### Backend
- **Framework**: Python FastAPI
- **Database ORM**: SQLAlchemy 2.0 with connection pooling
- **Database Engine**: PostgreSQL with automated zero-config SQLite fallback (`jobhunt.db`)
- **Security**: JWT authentication (`python-jose`), bcrypt password hashing, and server-side role authorization guards.
- **Email Service**: SMTP integration with fallback delivery logging to the `EmailDeliveryRecord` database table.

---

## 3. Six Standard Application Statuses

All applications follow the 6 lifecycle stages:
1. `Applied` — Initial submission with candidate resume.
2. `Under Review` — Recruiter reviewing candidate qualifications.
3. `Shortlisted` — Candidate selected for evaluation rounds.
4. `Interview Scheduled` — Interview slot confirmed with meeting link and date/time; automatic email invitation sent.
5. `Selected` — Official selection recorded with celebratory candidate banner and email notification.
6. `Not Selected` — Transparent rejection feedback recorded with candidate alert.

---

## 4. Getting Started (Windows PowerShell)

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### Step 1: Start FastAPI Backend
Open a PowerShell terminal:
```powershell
# Navigate to backend directory
cd c:\Users\Lenovo\Desktop\job_tracker\backend

# Install dependencies
pip install -r requirements.txt

# Run initial database seed (Seeds Manojkumar, Ravikumar, Divya & verified jobs)
python seed.py

# Launch FastAPI backend server (Runs on port 8000)
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```
- Interactive Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- Base API URL: [http://localhost:8000/api](http://localhost:8000/api)

### Step 2: Start Vite Frontend
Open a second PowerShell terminal:
```powershell
# Navigate to project root
cd c:\Users\Lenovo\Desktop\job_tracker

# Install frontend dependencies (if not already installed)
npm install

# Start Vite development server
npm run dev
```
- Web Application: [http://localhost:5173](http://localhost:5173)

---

## 5. End-to-End Automated Test Suite

A verification test script covers all 11 core workflows:
```powershell
cd c:\Users\Lenovo\Desktop\job_tracker\backend
python test_api_flow.py
```

### Verified Test Workflows:
- `[PASS]` 1. Admin Login (Manojkumar)
- `[PASS]` 2. Recruiter Login (Ravikumar — Hyundai Motor India)
- `[PASS]` 3. Recruiter Login (Divya — Freshworks Inc)
- `[PASS]` 4. Candidate Registration & Auth (Karthik Subramanian)
- `[PASS]` 5. Verified Job Search in Chennai (OMR Corridor)
- `[PASS]` 6. Candidate 1-Click Application Submission
- `[PASS]` 7. Recruiter Schedules Interview + Dispatches Email
- `[PASS]` 8. Recruiter Selection Workflow + Dispatches Selection Email
- `[PASS]` 9. AI Voice Query Parsing & Real Job Match Extraction
- `[PASS]` 10. Admin Console Platform Stats & User Management
- `[PASS]` 11. Admin Email Audit Logs in Database

---

## 6. API Route Reference

- `POST /api/auth/login` — Login with registered credentials.
- `POST /api/auth/register` — Public candidate registration.
- `GET  /api/auth/me` — Authenticated user profile.
- `GET  /api/jobs` — Browse jobs with district, category, experience, and search filters.
- `POST /api/jobs` — Create opening (Recruiter or Admin only).
- `GET  /api/applications` — Role-scoped applications (candidate sees own, recruiter sees applicants for their jobs, admin sees all).
- `POST /api/applications` — Apply for a job (enforces duplicate prevention).
- `PATCH /api/applications/{id}/status` — Update status across the 6 stages.
- `GET  /api/applications/{id}/resume` — Private resume download with role authorization.
- `POST /api/interviews` — Schedule interview with email trigger.
- `POST /api/ai/query` — AI Career Assistant search and guidance.
- `GET  /api/admin/stats` — Admin platform statistics.
- `POST /api/admin/recruiters` — Admin creates recruiter account.
- `PATCH /api/admin/users/{id}/toggle-status` — Admin activates/deactivates user.
- `GET  /api/admin/email-logs` — Audit log of all dispatched emails.
