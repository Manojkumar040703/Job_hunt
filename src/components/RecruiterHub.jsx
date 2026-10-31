import { useState } from "react";
import {
  IconPlus,
  IconBriefcase,
  IconUsers,
  IconCalendar,
  IconCheckCircle,
  IconBuilding,
  IconMapPin,
  IconClose,
  IconTrash,
  IconShield,
  IconFileText,
  IconSend,
  IconClock,
  IconSearch,
  IconSparkles,
  IconEdit,
} from "./Icons";
import { TAMIL_NADU_DISTRICTS, JOB_CATEGORIES } from "../data/tamilNaduData";
import { useAuth } from "../context/AuthContext";

// Curated Tamil Nadu Candidate Talent Pool for Recruiter Sourcing
const TN_TALENT_POOL = [
  {
    id: "cand-hari",
    name: "Hari",
    title: "Senior Full Stack Python/FastAPI Developer",
    district: "Coimbatore",
    city: "Gandhipuram",
    experience: "3 Years Experience",
    skills: ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Git", "REST APIs"],
    education: "B.E. CSE — Government College of Technology, Coimbatore (8.6 CGPA)",
    bio: "Passionate about building fast async APIs with Python, modern React interfaces, and SQL database design.",
    phone: "+91 97890 12345",
    email: "hari@demo.com",
    resumeFilename: "Hari_Resume_Demo.pdf",
    avatar: "H",
    verified: true,
  },
  {
    id: "cand-arun",
    name: "Arun Murugavel",
    title: "Automotive Embedded Firmware Engineer",
    district: "Kancheepuram",
    city: "Sriperumbudur",
    experience: "4 Years Experience",
    skills: ["Embedded C", "AUTOSAR", "CAN Bus", "RTOS", "Microcontrollers", "Python"],
    education: "B.E. EEE — PSG College of Technology, Coimbatore",
    bio: "Automotive systems firmware engineer specializing in CAN bus telemetry and battery management microcontrollers.",
    phone: "+91 99942 56897",
    email: "arun.murugavel@example.com",
    resumeFilename: "Arun_Embedded_Resume.pdf",
    avatar: "A",
    verified: true,
  },
  {
    id: "cand-priya",
    name: "Priya Natarajan",
    title: "Cloud Infrastructure & DevOps Specialist",
    district: "Chennai",
    city: "OMR, Perungudi",
    experience: "5 Years Experience",
    skills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Linux", "Python"],
    education: "B.Tech IT — Anna University, CEG Campus, Chennai",
    bio: "Infrastructure architect managing multi-region Kubernetes clusters, zero-downtime CI/CD pipelines, and cost optimization.",
    phone: "+91 98402 33445",
    email: "priya.n@example.com",
    resumeFilename: "Priya_Cloud_DevOps.pdf",
    avatar: "P",
    verified: true,
  },
  {
    id: "cand-kavitha",
    name: "Kavitha Sundaram",
    title: "Data Analyst & Business Intelligence Lead",
    district: "Madurai",
    city: "Anna Nagar",
    experience: "2.5 Years Experience",
    skills: ["SQL", "PowerBI", "Python", "Tableau", "Pandas", "ETL Pipelines"],
    education: "M.Sc Data Analytics — Thiagarajar College of Engineering, Madurai",
    bio: "Transforming raw manufacturing and financial streams into executive dashboards with automated anomaly alerts.",
    phone: "+91 94432 77889",
    email: "kavitha.s@example.com",
    resumeFilename: "Kavitha_Data_Resume.pdf",
    avatar: "K",
    verified: true,
  },
];

export default function RecruiterHub({
  jobs = [],
  applications = [],
  onPostJob,
  onUpdateJob,
  onDeleteJob,
  onUpdateApplicantStatus,
  onDeleteApplication,
  onScheduleInterview,
  onToast,
}) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState("applicants"); // "applicants" | "postings" | "sourcing"
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState(null);
  const [viewingResumeCandidate, setViewingResumeCandidate] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [applicantFilterRole, setApplicantFilterRole] = useState("ALL");
  const [sourcingSearch, setSourcingSearch] = useState("");

  const [editJobForm, setEditJobForm] = useState({
    title: "",
    company: "",
    district: "Chennai",
    city: "",
    workMode: "Hybrid",
    category: "it",
    type: "Full-time",
    experience: "3-5 years",
    salary: "",
    deadline: "",
    description: "",
    tags: "",
  });

  function handleOpenEditJob(job) {
    setEditingJob(job);
    setEditJobForm({
      title: job.title || "",
      company: job.company || user?.company || "",
      district: job.district || "Chennai",
      city: job.city || "",
      workMode: job.workMode || "Hybrid",
      category: job.category || "it",
      type: job.type || "Full-time",
      experience: job.experience || "3-5 years",
      salary: job.salary || "",
      deadline: job.deadline || "",
      description: job.description || "",
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : (job.tags || ""),
    });
  }

  function handleSaveEditJob(e) {
    e.preventDefault();
    if (!editingJob) return;
    const updated = {
      ...editingJob,
      ...editJobForm,
      tags: editJobForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
      location: `${editJobForm.district}, Tamil Nadu`,
      verifiedLocation: `${editJobForm.city}, ${editJobForm.district}, Tamil Nadu`,
    };
    if (onUpdateJob) onUpdateJob(updated);
    if (onToast) onToast(`✅ Updated opening "${updated.title}"!`);
    setEditingJob(null);
  }

  // Interview Schedule Form state
  const [interviewForm, setInterviewForm] = useState({
    date: "",
    time: "10:30 AM - 11:30 AM IST",
    mode: "Online Video Meeting",
    meetUrl: "https://meet.google.com/jh-interview-room",
    location: "Corporate Office Campus",
    instructions: "Please review the attached project code and have your camera on.",
  });

  const [newJobForm, setNewJobForm] = useState({
    title: "",
    company: user?.company || "Apex Mobility (Demo)",
    district: user?.district || "Chennai",
    city: user?.city || "Perungudi (OMR)",
    workMode: "Hybrid",
    category: "it",
    type: "Full-time",
    experience: "3-5 years",
    salary: "₹16,00,000 - ₹24,00,000 PA",
    deadline: "2026-11-30",
    description: "",
    tags: "Python, FastAPI, React, PostgreSQL",
  });

  // Filter jobs by current recruiter
  const currentRecruiterCompany = (user?.company || "").toLowerCase();
  const recruiterJobs = jobs.filter(
    (j) =>
      !user?.company ||
      j.company?.toLowerCase().includes(currentRecruiterCompany) ||
      currentRecruiterCompany.includes(j.company?.toLowerCase())
  );

  // Applications relevant to this recruiter's jobs or company
  const recruiterApplicants = applications.filter(
    (a) =>
      !user?.company ||
      a.company?.toLowerCase().includes(currentRecruiterCompany) ||
      currentRecruiterCompany.includes(a.company?.toLowerCase())
  );

  const filteredApplicants = applicantFilterRole === "ALL"
    ? recruiterApplicants
    : recruiterApplicants.filter((a) => a.role === applicantFilterRole);

  const interviewCount = recruiterApplicants.filter(
    (a) => (a.status || "").toLowerCase().includes("interview")
  ).length;

  const selectedCount = recruiterApplicants.filter(
    (a) => (a.status || "").toLowerCase() === "selected"
  ).length;

  function handlePostJobSubmit(e) {
    e.preventDefault();
    if (!newJobForm.title.trim()) return;

    const createdJob = {
      id: "job-" + Date.now(),
      title: newJobForm.title,
      company: newJobForm.company || user?.company || "Tamil Nadu Enterprise",
      recruiterId: user?.id,
      recruiterName: user?.name,
      district: newJobForm.district,
      city: newJobForm.city,
      location: `${newJobForm.district}, Tamil Nadu`,
      verifiedLocation: `${newJobForm.city}, ${newJobForm.district}, Tamil Nadu`,
      workMode: newJobForm.workMode,
      category: newJobForm.category,
      type: newJobForm.type,
      experience: newJobForm.experience,
      salary: newJobForm.salary,
      deadline: newJobForm.deadline,
      description:
        newJobForm.description ||
        "Exciting growth opportunity joining our collaborative engineering team in Tamil Nadu.",
      tags: newJobForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      postedDate: "Just now",
      status: "Active",
      logoColor: "#1d4ed8",
    };

    if (onPostJob) onPostJob(createdJob);
    setIsPostJobModalOpen(false);
    if (onToast) onToast(`✅ Published opening "${createdJob.title}" for ${createdJob.company}!`);

    setNewJobForm({
      title: "",
      company: user?.company || "Apex Mobility (Demo)",
      district: "Chennai",
      city: "Perungudi (OMR)",
      workMode: "Hybrid",
      category: "it",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹16,00,000 - ₹24,00,000 PA",
      deadline: "2026-11-30",
      description: "",
      tags: "Python, FastAPI, React, PostgreSQL",
    });
  }

  function handleStatusChange(appIndex, newStatus) {
    const targetApp = applications[appIndex];
    if (!targetApp) return;

    if (newStatus === "Interview Scheduled") {
      setSelectedAppForInterview({ app: targetApp, index: appIndex });
      setIsScheduleModalOpen(true);
      return;
    }

    if (onUpdateApplicantStatus) onUpdateApplicantStatus(appIndex, newStatus);

    if (newStatus === "Selected") {
      if (onToast)
        onToast(`🎉 Candidate ${targetApp.candidateName} marked as SELECTED! Offer notification sent.`);
    } else if (newStatus === "Not Selected") {
      if (onToast)
        onToast(`Candidate ${targetApp.candidateName} marked as Not Selected.`);
    } else {
      if (onToast)
        onToast(`Updated status to "${newStatus}" for ${targetApp.candidateName}.`);
    }
  }

  function handleConfirmInterviewSchedule(e) {
    e.preventDefault();
    if (!selectedAppForInterview) return;

    const { app, index } = selectedAppForInterview;

    // 1. Update status
    if (onUpdateApplicantStatus) onUpdateApplicantStatus(index, "Interview Scheduled");

    // 2. Schedule interview
    if (onScheduleInterview) {
      onScheduleInterview({
        id: "int-" + Date.now(),
        applicationId: app.id,
        candidateName: app.candidateName || "Candidate",
        company: app.company,
        role: app.role,
        roundName: "Technical Interview Round",
        date: interviewForm.date || new Date().toISOString().split("T")[0],
        time: interviewForm.time,
        mode: interviewForm.mode,
        meetUrl: interviewForm.meetUrl,
        location: interviewForm.location,
        instructions: interviewForm.instructions,
        status: "Scheduled",
      });
    }

    setIsScheduleModalOpen(false);
    setSelectedAppForInterview(null);
    if (onToast)
      onToast(`🗓️ Interview scheduled & confirmation email sent to ${app.candidateName}!`);
  }

  function handleInviteCandidate(candidate) {
    if (onToast) {
      onToast(`📨 Sourcing invitation dispatched to ${candidate.name} for ${user?.company || "our openings"}!`);
    }
  }

  // Filter talent pool by search query
  const filteredTalent = TN_TALENT_POOL.filter((c) => {
    if (!sourcingSearch.trim()) return true;
    const q = sourcingSearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  return (
    <div className="recruiter-hub-view">
      {/* Header Banner */}
      <div className="recruiter-header-banner">
        <div>
          <span className="recruiter-badge">
            <IconBuilding size={14} /> {user?.company ? `${user.company.toUpperCase()} HIRING WORKSPACE` : "RECRUITER WORKSPACE"}
          </span>
          <h1>Recruiter Dashboard: {user?.name || "Hiring Partner"}</h1>
          <p>
            Post verified openings across Tamil Nadu, manage applicant pipelines, review verified resumes, and schedule candidate interviews.
          </p>
        </div>

        <button
          type="button"
          id="btn-post-job-openings"
          className="btn btn-primary btn-lg"
          onClick={() => setIsPostJobModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}
        >
          <IconPlus size={18} /> Post New Opening in Tamil Nadu
        </button>
      </div>

      {/* Recruiter KPI Cards */}
      <div className="stats-grid">
        <div className="stats-card stats-card--primary">
          <div className="stats-card__header">
            <span className="stats-card__title">Active Job Openings</span>
            <div className="stats-card__icon-wrap"><IconBriefcase size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{recruiterJobs.length}</h3>
            <span className="stats-card__subtitle">Posted by {user?.company || user?.name || "you"}</span>
          </div>
        </div>

        <div className="stats-card stats-card--applied">
          <div className="stats-card__header">
            <span className="stats-card__title">Total Candidates</span>
            <div className="stats-card__icon-wrap"><IconUsers size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{recruiterApplicants.length}</h3>
            <span className="stats-card__subtitle">Applications received</span>
          </div>
        </div>

        <div className="stats-card stats-card--interview">
          <div className="stats-card__header">
            <span className="stats-card__title">Interviews Scheduled</span>
            <div className="stats-card__icon-wrap"><IconCalendar size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{interviewCount}</h3>
            <span className="stats-card__subtitle">Active interview rounds</span>
          </div>
        </div>

        <div className="stats-card stats-card--selected">
          <div className="stats-card__header">
            <span className="stats-card__title">Selected Candidates</span>
            <div className="stats-card__icon-wrap"><IconCheckCircle size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{selectedCount}</h3>
            <span className="stats-card__subtitle">Offers released</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="recruiter-subtabs" style={{ display: "flex", gap: "8px", borderBottom: "1px solid var(--border-light)", paddingBottom: "12px", marginBottom: "20px" }}>
        <button
          type="button"
          className={`subtab-btn ${activeSubTab === "applicants" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveSubTab("applicants")}
        >
          <IconUsers size={16} /> Candidate Stream ({recruiterApplicants.length})
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeSubTab === "postings" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveSubTab("postings")}
        >
          <IconBriefcase size={16} /> Manage My Openings ({recruiterJobs.length})
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeSubTab === "sourcing" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveSubTab("sourcing")}
        >
          <IconSearch size={16} /> Sourcing & Talent Pool (Tamil Nadu)
        </button>
      </div>

      {/* Tab 1: Applicants Stream */}
      {activeSubTab === "applicants" && (
        <div className="app-table-container">
          <div className="table-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div className="table-toolbar__title-group">
              <h2>Candidate Pipeline for {user?.company || "Your Company"}</h2>
              <span className="badge-count">{filteredApplicants.length} candidates</span>
            </div>

            {/* Filter by role */}
            {recruiterJobs.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Filter by Opening:</span>
                <select
                  value={applicantFilterRole}
                  onChange={(e) => setApplicantFilterRole(e.target.value)}
                  style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid var(--border-light)", fontSize: "13px" }}
                >
                  <option value="ALL">All Openings ({recruiterApplicants.length})</option>
                  {recruiterJobs.map((j) => (
                    <option key={j.id} value={j.title}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {filteredApplicants.length === 0 ? (
            <div className="table-empty-state" style={{ padding: "48px 24px", textAlign: "center" }}>
              <IconUsers size={48} style={{ opacity: 0.4, marginBottom: "12px" }} />
              <h3>No candidate applications in this filter</h3>
              <p style={{ maxWidth: "460px", margin: "8px auto 16px", color: "var(--text-muted)", fontSize: "14px" }}>
                Candidates who apply to your Tamil Nadu openings will appear here. You can also discover candidates directly in the "Sourcing & Talent Pool" tab!
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsPostJobModalOpen(true)}
              >
                <IconPlus size={16} /> Post Another Opening
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Target Role</th>
                    <th>Resume</th>
                    <th>Applied Date</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: "right" }}>Recruiter Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((app) => {
                    const originalIndex = applications.indexOf(app);

                    return (
                      <tr key={app.id || originalIndex} className="table-row">
                        {/* Candidate info with avatar */}
                        <td>
                          <div className="cell-company-role">
                            <div className="company-avatar" style={{ background: "#e0e7ff", color: "#3730a3", fontWeight: 700 }}>
                              {app.candidateName ? app.candidateName.charAt(0).toUpperCase() : "C"}
                            </div>
                            <div>
                              <span className="company-name">{app.candidateName || "Candidate"}</span>
                              <span className="role-title">{app.location || "Tamil Nadu"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td>
                          <span className="role-title" style={{ fontWeight: 700 }}>{app.role}</span>
                          <span className="salary-subtext">{app.salary || "Standard Package"}</span>
                        </td>

                        {/* Resume PDF Download */}
                        <td>
                          <button
                            type="button"
                            className="btn-download-resume"
                            onClick={() => {
                              setViewingResumeCandidate(app);
                            }}
                            title="Preview Candidate Profile & Resume"
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 10px", borderRadius: "6px", fontSize: "12px", border: "1px solid var(--border-light)", background: "var(--bg-surface)", cursor: "pointer" }}
                          >
                            <IconFileText size={15} />
                            <span>Preview Resume</span>
                          </button>
                        </td>

                        {/* Date */}
                        <td>
                          <span className="date-text">{app.appliedDate || "Recently"}</span>
                        </td>

                        {/* Status badge */}
                        <td>
                          <span className={`status-badge status--${(app.status || "applied").toLowerCase().replace(/\s+/g, "-")}`}>
                            {app.status || "Applied"}
                          </span>
                        </td>

                        {/* Action Status Selector */}
                        <td style={{ textAlign: "right" }}>
                          <div className="row-actions-group">
                            <select
                              className="recruiter-status-select"
                              value={app.status || "Applied"}
                              onChange={(e) => handleStatusChange(originalIndex, e.target.value)}
                            >
                              <option value="Applied">Status: Applied</option>
                              <option value="Under Review">Under Review 🔍</option>
                              <option value="Shortlisted">Shortlisted ⭐</option>
                              <option value="Interview Scheduled">Schedule Interview 🗓️</option>
                              <option value="Selected">Select Candidate 🎉</option>
                              <option value="Not Selected">Not Selected ❌</option>
                            </select>

                            <button
                              type="button"
                              className="btn-action btn-action--delete"
                              onClick={() => onDeleteApplication && onDeleteApplication(originalIndex)}
                              title="Delete entry"
                            >
                              <IconTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage Job Openings */}
      {activeSubTab === "postings" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>Active Openings Posted by {user?.company || user?.name || "Your Enterprise"}</h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsPostJobModalOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <IconPlus size={16} /> + Post New Opening
            </button>
          </div>

          {recruiterJobs.length === 0 ? (
            <div className="table-empty-state" style={{ padding: "48px 24px", textAlign: "center" }}>
              <IconBriefcase size={48} style={{ opacity: 0.4, marginBottom: "12px" }} />
              <h3>No Active Openings Yet</h3>
              <p style={{ maxWidth: "440px", margin: "8px auto 16px", color: "var(--text-muted)" }}>
                Start hiring Tamil Nadu talent by publishing your first job vacancy. It will immediately show across all 38 districts!
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsPostJobModalOpen(true)}
              >
                <IconPlus size={16} /> Post First Opening
              </button>
            </div>
          ) : (
            <div className="recruiter-postings-grid">
              {recruiterJobs.map((job) => {
                const jobApplicantsCount = applications.filter(
                  (a) => a.jobId === job.id || (a.role && a.role.toLowerCase() === job.title.toLowerCase())
                ).length;

                return (
                  <div key={job.id} className="recruiter-job-card">
                    <div className="recruiter-job-card__header">
                      <div>
                        <h4>{job.title}</h4>
                        <span className="recruiter-job-sub">
                          {job.company} • {job.district || job.location} ({job.workMode || "On-site"})
                        </span>
                      </div>
                      <span className="active-tag">{job.status || "Active in TN"}</span>
                    </div>

                    <div className="recruiter-job-meta">
                      <span>💰 {job.salary}</span>
                      <span>⏱️ {job.type || "Full-time"}</span>
                      <span>📅 Deadline: {job.deadline || "Open"}</span>
                    </div>

                    <p className="recruiter-job-desc">{job.description}</p>

                    {job.tags && job.tags.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {job.tags.slice(0, 5).map((t, idx) => (
                          <span key={idx} style={{ background: "var(--bg-muted, #f1f5f9)", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", color: "var(--text-muted)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="recruiter-job-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="applicant-counter">
                        <strong>{jobApplicantsCount}</strong> candidates applied
                      </span>

                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setApplicantFilterRole(job.title);
                            setActiveSubTab("applicants");
                          }}
                        >
                          View Candidates ({jobApplicantsCount})
                        </button>

                        <button
                          type="button"
                          className="btn-action btn-action--edit"
                          onClick={() => handleOpenEditJob(job)}
                          title="Edit Opening Details"
                        >
                          <IconEdit size={13} /> Edit
                        </button>

                        <button
                          type="button"
                          className="btn-action btn-action--delete"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete and close opening "${job.title}"?`)) {
                              if (onDeleteJob) {
                                onDeleteJob(job.id);
                                if (onToast) onToast(`🗑️ Closed and archived opening "${job.title}".`);
                              }
                            }
                          }}
                          title="Close / Delete Opening"
                        >
                          <IconTrash size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sourcing & Talent Pool */}
      {activeSubTab === "sourcing" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h3 style={{ margin: 0 }}>Tamil Nadu Candidate Talent Directory</h3>
              <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--text-muted)" }}>
                Discover verified professionals across 38 districts and invite them directly to apply.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
              <input
                type="text"
                placeholder="Search by skill, name or district..."
                value={sourcingSearch}
                onChange={(e) => setSourcingSearch(e.target.value)}
                style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-light)", width: "260px", fontSize: "13px" }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
            {filteredTalent.map((cand) => (
              <div
                key={cand.id}
                className="recruiter-job-card"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-light)", borderRadius: "12px", padding: "18px" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#e0e7ff", color: "#3730a3", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "18px" }}>
                    {cand.avatar}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "16px" }}>{cand.name}</h4>
                    <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 600 }}>{cand.title}</span>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                      📍 {cand.city}, {cand.district} • {cand.experience}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 10px", lineHeight: "1.4" }}>
                  {cand.bio}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
                  {cand.skills.map((s, idx) => (
                    <span key={idx} style={{ background: "rgba(79, 70, 229, 0.08)", color: "#4f46e5", padding: "2px 7px", borderRadius: "4px", fontSize: "11px", fontWeight: 600 }}>
                      {s}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--border-subtle, #f1f5f9)", paddingTop: "12px" }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setViewingResumeCandidate({
                        candidateName: cand.name,
                        role: cand.title,
                        location: `${cand.city}, ${cand.district}, Tamil Nadu`,
                        candidateEmail: cand.email,
                        candidatePhone: cand.phone,
                        notes: cand.bio,
                        skills: cand.skills,
                        education: cand.education,
                        company: user?.company || "Your Company",
                      });
                    }}
                  >
                    View CV
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => handleInviteCandidate(cand)}
                  >
                    <IconSend size={14} /> Invite to Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidate Resume Preview Modal */}
      {viewingResumeCandidate && (
        <div className="modal-backdrop" onClick={() => setViewingResumeCandidate(null)}>
          <div
            className="modal-content auth-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "600px", padding: "28px", maxHeight: "90vh", overflowY: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-light)", paddingBottom: "16px", marginBottom: "18px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#e0e7ff", color: "#3730a3", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "20px" }}>
                  {viewingResumeCandidate.candidateName ? viewingResumeCandidate.candidateName.charAt(0) : "C"}
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>{viewingResumeCandidate.candidateName || "Candidate"}</h3>
                  <span style={{ fontSize: "14px", color: "var(--primary)", fontWeight: 600 }}>
                    {viewingResumeCandidate.role || "Target Role"}
                  </span>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    📍 {viewingResumeCandidate.location || "Tamil Nadu"} • Verified Profile
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setViewingResumeCandidate(null)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <strong style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                  Contact Information
                </strong>
                <div style={{ display: "flex", gap: "16px", marginTop: "6px", fontSize: "13px" }}>
                  <span>📧 {viewingResumeCandidate.candidateEmail || "candidate@demo.com"}</span>
                  <span>📞 {viewingResumeCandidate.candidatePhone || "+91 97890 12345"}</span>
                </div>
              </div>

              <div>
                <strong style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                  Candidate Summary & Cover Note
                </strong>
                <p style={{ margin: "6px 0 0", fontSize: "13px", lineHeight: "1.5", background: "var(--bg-muted, #f8fafc)", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border-light)" }}>
                  {viewingResumeCandidate.notes || "Demonstrated track record of delivering reliable production features, fast async web APIs with Python and modern React UI components in Tamil Nadu."}
                </p>
              </div>

              <div>
                <strong style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                  Verified Skills
                </strong>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
                  {(viewingResumeCandidate.skills || ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "REST APIs"]).map((s, idx) => (
                    <span key={idx} style={{ background: "rgba(79, 70, 229, 0.1)", color: "#4f46e5", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600 }}>
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <strong style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>
                  Education & Credentials
                </strong>
                <p style={{ margin: "6px 0 0", fontSize: "13px" }}>
                  {viewingResumeCandidate.education || "B.E. Computer Science and Engineering — Government College of Technology, Coimbatore (8.6 CGPA)"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border-light)" }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (onToast) onToast(`📄 Downloaded verified PDF resume for ${viewingResumeCandidate.candidateName || "Candidate"}.`);
                }}
              >
                <IconFileText size={16} /> Download PDF
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const originalIndex = applications.findIndex((a) => a.id === viewingResumeCandidate.id);
                  setViewingResumeCandidate(null);
                  if (originalIndex >= 0) {
                    setSelectedAppForInterview({ app: viewingResumeCandidate, index: originalIndex });
                    setIsScheduleModalOpen(true);
                  } else {
                    if (onToast) onToast(`Candidate selected for interview round!`);
                  }
                }}
              >
                <IconCalendar size={16} /> Schedule Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post a New Job Modal */}
      {isPostJobModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPostJobModalOpen(false)}>
          <div className="modal-content post-job-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="add-app-card__header">
              <div>
                <h3>Post a New Job in Tamil Nadu</h3>
                <p className="add-app-card__desc">
                  Publish verified vacancies across 38 districts on behalf of {user?.company || "your enterprise"}.
                </p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsPostJobModalOpen(false)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handlePostJobSubmit} className="add-app-form">
              <div className="form-grid">
                <div className="form-group form-group--full">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Python Developer or EV Systems Engineer"
                    value={newJobForm.title}
                    onChange={(e) => setNewJobForm({ ...newJobForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    value={newJobForm.company}
                    onChange={(e) => setNewJobForm({ ...newJobForm, company: e.target.value })}
                    placeholder="e.g. Apex Mobility, Zoho, TVS Motor"
                  />
                </div>

                <div className="form-group">
                  <label>Tamil Nadu District *</label>
                  <select
                    value={newJobForm.district}
                    onChange={(e) => setNewJobForm({ ...newJobForm, district: e.target.value })}
                  >
                    {TAMIL_NADU_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City / Industrial Zone *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sriperumbudur, OMR Perungudi, Peelamedu"
                    value={newJobForm.city}
                    onChange={(e) => setNewJobForm({ ...newJobForm, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Industry / Sector *</label>
                  <select
                    value={newJobForm.category}
                    onChange={(e) => setNewJobForm({ ...newJobForm, category: e.target.value })}
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Work Mode</label>
                  <select
                    value={newJobForm.workMode}
                    onChange={(e) => setNewJobForm({ ...newJobForm, workMode: e.target.value })}
                  >
                    <option value="On-site">On-site in Tamil Nadu</option>
                    <option value="Hybrid">Hybrid (Flexible)</option>
                    <option value="Remote">Remote (TN Residents)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Salary Package</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹14,00,000 - ₹22,00,000 PA"
                    value={newJobForm.salary}
                    onChange={(e) => setNewJobForm({ ...newJobForm, salary: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Experience Required</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-5 years"
                    value={newJobForm.experience}
                    onChange={(e) => setNewJobForm({ ...newJobForm, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    value={newJobForm.deadline}
                    onChange={(e) => setNewJobForm({ ...newJobForm, deadline: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Python, FastAPI, React, PostgreSQL, Docker"
                    value={newJobForm.tags}
                    onChange={(e) => setNewJobForm({ ...newJobForm, tags: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Job Description & Responsibilities</label>
                  <textarea
                    rows={4}
                    placeholder="Describe role impact, team requirements, and technical expectations..."
                    value={newJobForm.description}
                    onChange={(e) => setNewJobForm({ ...newJobForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPostJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" id="btn-submit-publish-opening" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  <IconPlus size={16} /> Publish Opening Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {isScheduleModalOpen && selectedAppForInterview && (
        <div className="modal-backdrop" onClick={() => setIsScheduleModalOpen(false)}>
          <div className="modal-content schedule-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>Schedule Interview: {selectedAppForInterview.app.candidateName}</h3>
                <p className="schedule-sub" style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  Role: <strong>{selectedAppForInterview.app.role}</strong> at {selectedAppForInterview.app.company}
                </p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmInterviewSchedule} className="schedule-form" style={{ marginTop: "14px" }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Interview Format</label>
                  <select
                    value={interviewForm.mode}
                    onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                  >
                    <option value="Online Video Meeting">Online Video Meeting (Google Meet)</option>
                    <option value="In-Person Office / Plant Round">In-Person Office / Plant Round</option>
                    <option value="Telephonic Technical Screening">Telephonic Technical Screening</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Meeting URL / Room Link</label>
                  <input
                    type="url"
                    value={interviewForm.meetUrl}
                    onChange={(e) => setInterviewForm({ ...interviewForm, meetUrl: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Preparation Notes & Instructions to Candidate</label>
                  <textarea
                    rows={3}
                    value={interviewForm.instructions}
                    onChange={(e) => setInterviewForm({ ...interviewForm, instructions: e.target.value })}
                  />
                </div>
              </div>

              <div className="email-dispatch-notice" style={{ marginTop: "12px", padding: "10px", background: "rgba(79, 70, 229, 0.08)", borderRadius: "8px", display: "flex", gap: "8px", alignItems: "center", fontSize: "12px", color: "var(--primary)" }}>
                <IconSend size={14} />
                <span>An automated interview invitation email with Google Meet details will be dispatched to {selectedAppForInterview.app.candidateName}.</span>
              </div>

              <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsScheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  Confirm & Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Opening Modal for Recruiters */}
      {editingJob && (
        <div className="modal-backdrop" onClick={() => setEditingJob(null)}>
          <div className="modal-content post-job-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="add-app-card__header">
              <div>
                <h3 style={{ margin: 0 }}>Edit Job Opening: {editingJob.title}</h3>
                <p className="add-app-card__desc">
                  Update opening details, salary range, deadline, or requirements.
                </p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setEditingJob(null)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditJob} className="add-app-form">
              <div className="form-grid">
                <div className="form-group form-group--full">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    required
                    value={editJobForm.title}
                    onChange={(e) => setEditJobForm({ ...editJobForm, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editJobForm.company}
                    onChange={(e) => setEditJobForm({ ...editJobForm, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Tamil Nadu District *</label>
                  <select
                    value={editJobForm.district}
                    onChange={(e) => setEditJobForm({ ...editJobForm, district: e.target.value })}
                  >
                    {TAMIL_NADU_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City / Industrial Zone *</label>
                  <input
                    type="text"
                    required
                    value={editJobForm.city}
                    onChange={(e) => setEditJobForm({ ...editJobForm, city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Work Mode</label>
                  <select
                    value={editJobForm.workMode}
                    onChange={(e) => setEditJobForm({ ...editJobForm, workMode: e.target.value })}
                  >
                    <option value="On-site">On-site in Tamil Nadu</option>
                    <option value="Hybrid">Hybrid (Flexible)</option>
                    <option value="Remote">Remote (TN Residents)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Salary Package</label>
                  <input
                    type="text"
                    value={editJobForm.salary}
                    onChange={(e) => setEditJobForm({ ...editJobForm, salary: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Experience Required</label>
                  <input
                    type="text"
                    value={editJobForm.experience}
                    onChange={(e) => setEditJobForm({ ...editJobForm, experience: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Application Deadline</label>
                  <input
                    type="date"
                    value={editJobForm.deadline}
                    onChange={(e) => setEditJobForm({ ...editJobForm, deadline: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={editJobForm.tags}
                    onChange={(e) => setEditJobForm({ ...editJobForm, tags: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Job Description & Responsibilities</label>
                  <textarea
                    rows={4}
                    value={editJobForm.description}
                    onChange={(e) => setEditJobForm({ ...editJobForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingJob(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  Save Opening Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
