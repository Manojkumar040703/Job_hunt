import { useState, useEffect } from "react";
import api from "../services/api";
import {
  IconShield,
  IconCheckCircle,
  IconXCircle,
  IconBriefcase,
  IconBuilding,
  IconUsers,
  IconMapPin,
  IconSearch,
  IconClock,
  IconPlus,
  IconSend,
  IconClose,
  IconEdit,
  IconTrash,
} from "./Icons";
import { TAMIL_NADU_DISTRICTS, JOB_CATEGORIES } from "../data/tamilNaduData";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard({
  jobs = [],
  applications = [],
  onUpdateJob,
  onDeleteJob,
  onDeleteApplication,
  onToast,
}) {
  const {
    user,
    managedRecruiters,
    createRecruiter,
    updateRecruiter,
    deleteRecruiter,
    toggleRecruiterStatus,
  } = useAuth();

  const [activeTab, setActiveTab] = useState("recruiters"); // "recruiters" | "jobs" | "applications" | "districts" | "emails"
  const [isAddRecruiterModalOpen, setIsAddRecruiterModalOpen] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const [newRecruiterForm, setNewRecruiterForm] = useState({
    name: "",
    email: "",
    company: "",
    title: "Senior Talent Lead",
    district: "Chennai",
    city: "Chennai City",
    phone: "+91 98400 12345",
  });

  const [editRecruiterForm, setEditRecruiterForm] = useState({
    name: "",
    email: "",
    company: "",
    title: "",
    district: "Chennai",
    city: "",
    phone: "",
  });

  const [editJobForm, setEditJobForm] = useState({
    title: "",
    company: "",
    district: "Chennai",
    city: "",
    category: "it",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "3-5 years",
    salary: "",
    deadline: "",
    description: "",
    tags: "",
  });

  const [emailLogs] = useState([
    {
      id: "em-1",
      recipient: "karthik.subramanian@example.com",
      subject: "Interview Invitation: Senior Full Stack Python Developer @ Freshworks",
      type: "Interview Scheduled",
      status: "Delivered",
      time: "Today, 10:30 AM",
    },
    {
      id: "em-2",
      recipient: "arun.murugavel@example.com",
      subject: "Selection Offer: Textile Quality Lead @ KPR Mill",
      type: "Candidate Selected",
      status: "Delivered",
      time: "Yesterday, 04:15 PM",
    },
    {
      id: "em-3",
      recipient: "candidate.test@example.com",
      subject: "Application Status Update: Junior Developer @ Cognizant",
      type: "Status Update",
      status: "Delivered",
      time: "Oct 24, 11:00 AM",
    },
  ]);

  const [liveEmailLogs, setLiveEmailLogs] = useState([]);
  const [liveStats, setLiveStats] = useState(null);

  useEffect(() => {
    api.admin.getEmailLogs()
      .then((records) => {
        if (records && records.length > 0) {
          const mapped = records.map((r) => ({
            id: r.id,
            recipient: r.recipient_email,
            subject: r.subject,
            type: r.template_type?.toUpperCase() || "DISPATCH",
            status: r.status,
            time: new Date(r.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }));
          setLiveEmailLogs(mapped);
        }
      })
      .catch(() => {});

    api.admin.getStats()
      .then((s) => {
        if (s) setLiveStats(s);
      })
      .catch(() => {});
  }, []);

  const displayEmailLogs = liveEmailLogs.length > 0 ? liveEmailLogs : emailLogs;

  function handleCreateRecruiterSubmit(e) {
    e.preventDefault();
    if (!newRecruiterForm.name.trim() || !newRecruiterForm.email.trim()) return;

    const res = createRecruiter(newRecruiterForm);
    if (res && res.success) {
      if (onToast) onToast(`✅ Created and authorized recruiter account for ${newRecruiterForm.name}!`);
      setIsAddRecruiterModalOpen(false);
      setNewRecruiterForm({
        name: "",
        email: "",
        company: "",
        title: "Senior Talent Lead",
        district: "Chennai",
        city: "Chennai City",
        phone: "+91 98400 12345",
      });
    } else {
      if (onToast) onToast(res.error || "Failed to create recruiter");
    }
  }

  function handleOpenEditRecruiter(rec) {
    setEditingRecruiter(rec);
    setEditRecruiterForm({
      name: rec.name || "",
      email: rec.email || "",
      company: rec.company || "",
      title: rec.title || "Talent Acquisition Lead",
      district: rec.district || "Chennai",
      city: rec.city || "",
      phone: rec.phone || "",
    });
  }

  function handleSaveEditRecruiter(e) {
    e.preventDefault();
    if (!editingRecruiter) return;
    if (updateRecruiter) {
      updateRecruiter(editingRecruiter.id, editRecruiterForm);
      if (onToast) onToast(`✅ Updated recruiter details for ${editRecruiterForm.name}!`);
    }
    setEditingRecruiter(null);
  }

  function handleDeleteRecruiterClick(rec) {
    if (window.confirm(`Are you sure you want to permanently delete recruiter account "${rec.name}" (${rec.company})?`)) {
      if (deleteRecruiter) {
        deleteRecruiter(rec.id);
        if (onToast) onToast(`🗑️ Deleted recruiter account for ${rec.name}.`);
      }
    }
  }

  function handleOpenEditJob(job) {
    setEditingJob(job);
    setEditJobForm({
      title: job.title || "",
      company: job.company || "",
      district: job.district || "Chennai",
      city: job.city || "",
      category: job.category || "it",
      workMode: job.workMode || "On-site",
      type: job.type || "Full-time",
      experience: job.experience || "2-5 years",
      salary: job.salary || "",
      deadline: job.deadline || "",
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : (job.tags || ""),
      description: job.description || "",
    });
  }

  function handleSaveEditJob(e) {
    e.preventDefault();
    if (!editingJob) return;
    if (onUpdateJob) {
      const updated = {
        ...editingJob,
        ...editJobForm,
        tags: editJobForm.tags.split(",").map((t) => t.trim()).filter(Boolean),
        location: `${editJobForm.district}, Tamil Nadu`,
        verifiedLocation: `${editJobForm.city}, ${editJobForm.district}, Tamil Nadu`,
      };
      onUpdateJob(updated);
      if (onToast) onToast(`✅ Successfully updated job "${updated.title}"!`);
    }
    setEditingJob(null);
  }

  return (
    <div className="admin-dashboard-view">
      {/* Admin Header Banner */}
      <div className="admin-header-banner">
        <div>
          <span className="admin-badge">
            <IconShield size={14} /> STATE GOVERNANCE CONSOLE — CHIEF ADMIN
          </span>
          <h1>Admin Control Center: Manojkumar</h1>
          <p>
            Sole administrator of Job Hunt. Manage recruiter credentials, edit/delete accounts and postings across Tamil Nadu, and moderate candidate workflows.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsAddRecruiterModalOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}
        >
          <IconPlus size={16} /> Authorize New Recruiter
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stats-card stats-card--primary">
          <div className="stats-card__header">
            <span className="stats-card__title">Managed Recruiters</span>
            <div className="stats-card__icon-wrap"><IconBuilding size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{liveStats?.total_recruiters ?? (managedRecruiters?.length || 2)}</h3>
            <span className="stats-card__subtitle">Authorized employer accounts</span>
          </div>
        </div>

        <div className="stats-card stats-card--applied">
          <div className="stats-card__header">
            <span className="stats-card__title">Live Openings</span>
            <div className="stats-card__icon-wrap"><IconBriefcase size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{liveStats?.active_jobs ?? jobs.length}</h3>
            <span className="stats-card__subtitle">Across 38 TN Districts</span>
          </div>
        </div>

        <div className="stats-card stats-card--interview">
          <div className="stats-card__header">
            <span className="stats-card__title">Total Applications</span>
            <div className="stats-card__icon-wrap"><IconUsers size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">{liveStats?.total_applications ?? applications.length}</h3>
            <span className="stats-card__subtitle">Statewide candidate stream</span>
          </div>
        </div>

        <div className="stats-card stats-card--selected">
          <div className="stats-card__header">
            <span className="stats-card__title">State Coverage</span>
            <div className="stats-card__icon-wrap"><IconMapPin size={22} /></div>
          </div>
          <div className="stats-card__body">
            <h3 className="stats-card__number">38 / 38</h3>
            <span className="stats-card__subtitle">Districts active</span>
          </div>
        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="admin-subtabs-row">
        <button
          type="button"
          className={`subtab-btn ${activeTab === "recruiters" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveTab("recruiters")}
        >
          <IconBuilding size={16} /> Recruiters ({managedRecruiters?.length || 2})
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === "jobs" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          <IconBriefcase size={16} /> All Jobs Moderation ({jobs.length})
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === "applications" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          <IconUsers size={16} /> Applications Stream ({applications.length})
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === "districts" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveTab("districts")}
        >
          <IconMapPin size={16} /> 38 District Operations
        </button>

        <button
          type="button"
          className={`subtab-btn ${activeTab === "emails" ? "subtab-btn--active" : ""}`}
          onClick={() => setActiveTab("emails")}
        >
          <IconSend size={16} /> Email Delivery Records
        </button>
      </div>

      {/* Tab 1: Manage Recruiters */}
      {activeTab === "recruiters" && (
        <div className="app-table-container">
          <div className="table-toolbar">
            <div className="table-toolbar__title-group">
              <h2>Authorized Recruiter Accounts</h2>
              <span className="badge-count">Managed by Manojkumar</span>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsAddRecruiterModalOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <IconPlus size={15} /> + Add Recruiter
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Recruiter Name</th>
                  <th>Company Organization</th>
                  <th>Email Login</th>
                  <th>Location</th>
                  <th>Account Status</th>
                  <th style={{ textAlign: "right" }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {managedRecruiters.map((rec) => (
                  <tr key={rec.id} className="table-row">
                    <td>
                      <div className="cell-company-role">
                        <div className="company-avatar" style={{ background: "var(--primary-light)", color: "var(--primary)", border: "1px solid var(--primary-border)", fontWeight: 700 }}>
                          {rec.avatar || (rec.name ? rec.name.charAt(0).toUpperCase() : "R")}
                        </div>
                        <div>
                          <span className="company-name">{rec.name}</span>
                          <span className="role-title">{rec.title}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="company-name" style={{ fontWeight: 600 }}>{rec.company}</span>
                    </td>

                    <td>
                      <code>{rec.email}</code>
                    </td>

                    <td>
                      <span className="location-cell">
                        <IconMapPin size={13} /> {rec.district}, TN
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge ${rec.isActive ? "status--selected" : "status--rejected"}`}>
                        {rec.isActive ? "✓ Active & Authorized" : "✕ Deactivated"}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn-action btn-action--edit"
                          onClick={() => handleOpenEditRecruiter(rec)}
                          title="Edit Recruiter Details"
                        >
                          <IconEdit size={13} /> Edit
                        </button>

                        <button
                          type="button"
                          className={`btn-action ${rec.isActive ? "btn-action--deactivate" : "btn-action--activate"}`}
                          onClick={() => {
                            toggleRecruiterStatus(rec.id);
                            if (onToast) onToast(rec.isActive ? `⚠️ Deactivated recruiter account for ${rec.name}` : `✅ Activated recruiter account for ${rec.name}`);
                          }}
                          title={rec.isActive ? "Deactivate Recruiter" : "Authorize Recruiter"}
                        >
                          {rec.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          type="button"
                          className="btn-action btn-action--delete"
                          onClick={() => handleDeleteRecruiterClick(rec)}
                          title="Delete Recruiter Account"
                        >
                          <IconTrash size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: All Jobs Moderation */}
      {activeTab === "jobs" && (
        <div className="app-table-container">
          <div className="table-toolbar">
            <div className="table-toolbar__title-group">
              <h2>All Tamil Nadu Job Postings</h2>
              <span className="badge-count">{jobs.length} postings</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title & Company</th>
                  <th>Recruiter / Author</th>
                  <th>District Location</th>
                  <th>Salary Range</th>
                  <th style={{ textAlign: "right" }}>Moderation Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="table-row">
                    <td>
                      <div className="cell-company-role">
                        <div className="company-avatar" style={{ backgroundColor: job.logoColor || "#1d4ed8", color: "#fff", fontWeight: 700 }}>
                          {job.company ? job.company.charAt(0).toUpperCase() : "J"}
                        </div>
                        <div>
                          <span className="company-name">{job.title}</span>
                          <span className="role-title">{job.company}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="role-title">{job.recruiterName || "Authorized Recruiter"}</span>
                    </td>

                    <td>
                      <span className="location-cell">
                        <IconMapPin size={13} /> {job.district || job.location}
                      </span>
                    </td>

                    <td>
                      <span className="salary-pill">{job.salary}</span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", justifyContent: "flex-end" }}>
                        <button
                          type="button"
                          className="btn-action btn-action--edit"
                          onClick={() => handleOpenEditJob(job)}
                          title="Edit Job Posting"
                        >
                          <IconEdit size={13} /> Edit
                        </button>

                        <button
                          type="button"
                          className="btn-action btn-action--delete"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete job "${job.title}" by ${job.company}?`)) {
                              if (onDeleteJob) onDeleteJob(job.id);
                              if (onToast) onToast(`🗑️ Removed job posting "${job.title}".`);
                            }
                          }}
                          title="Delete Job"
                        >
                          <IconTrash size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Applications Stream */}
      {activeTab === "applications" && (
        <div className="app-table-container">
          <div className="table-toolbar">
            <div className="table-toolbar__title-group">
              <h2>Statewide Candidate Applications</h2>
              <span className="badge-count">{applications.length} applications</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Applied Role</th>
                  <th>Company</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Admin Action</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => (
                  <tr key={app.id || idx} className="table-row">
                    <td>
                      <span className="company-name">{app.candidateName || "Candidate"}</span>
                    </td>
                    <td>
                      <span className="role-title">{app.role}</span>
                    </td>
                    <td>{app.company}</td>
                    <td>{app.appliedDate}</td>
                    <td>
                      <span className={`status-badge status--${(app.status || "applied").toLowerCase().replace(/\s+/g, "-")}`}>
                        {app.status}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn-action btn-action--delete"
                        onClick={() => {
                          if (window.confirm(`Delete application for ${app.candidateName || "Candidate"}?`)) {
                            if (onDeleteApplication) onDeleteApplication(app.id || idx);
                            if (onToast) onToast("🗑️ Application entry deleted.");
                          }
                        }}
                        title="Delete Application Entry"
                      >
                        <IconTrash size={13} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: 38 Districts */}
      {activeTab === "districts" && (
        <div className="districts-grid-view">
          {TAMIL_NADU_DISTRICTS.map((dist) => {
            const count = jobs.filter(
              (j) => j.district?.toLowerCase() === dist.toLowerCase()
            ).length;

            return (
              <div key={dist} className="district-stat-card">
                <div className="district-header">
                  <h4>{dist}</h4>
                  <span className={`district-status-dot ${count > 0 ? "district-status-dot--active" : ""}`} />
                </div>
                <div className="district-body">
                  <span className="active-jobs-count">
                    <strong>{count}</strong> Active Openings
                  </span>
                  <span className="district-region">Tamil Nadu</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 5: Email Records */}
      {activeTab === "emails" && (
        <div className="app-table-container">
          <div className="table-toolbar">
            <div className="table-toolbar__title-group">
              <h2>Email Notification Delivery Records</h2>
              <span className="badge-count">Audit Log</span>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Recipient Email</th>
                  <th>Notification Subject</th>
                  <th>Trigger Event</th>
                  <th>Delivery Status</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {displayEmailLogs.map((log) => (
                  <tr key={log.id} className="table-row">
                    <td><code>{log.recipient}</code></td>
                    <td><strong className="company-name">{log.subject}</strong></td>
                    <td><span className="sector-tag">{log.type}</span></td>
                    <td>
                      <span className="status-badge status--selected">
                        <IconCheckCircle size={13} /> {log.status}
                      </span>
                    </td>
                    <td><span className="date-text">{log.time}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Authorize New Recruiter Modal */}
      {isAddRecruiterModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddRecruiterModalOpen(false)}>
          <div className="modal-content auth-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0 }}>Authorize New Recruiter Account</h3>
                <p className="auth-subtitle">Only Administrator Manojkumar can provision employer recruiter logins.</p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsAddRecruiterModalOpen(false)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRecruiterSubmit} className="auth-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Recruiter Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sangeetha Rajan"
                    value={newRecruiterForm.name}
                    onChange={(e) => setNewRecruiterForm({ ...newRecruiterForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Corporate Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sangeetha@company.com"
                    value={newRecruiterForm.email}
                    onChange={(e) => setNewRecruiterForm({ ...newRecruiterForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Employer Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L&T Construction or Zoho"
                    value={newRecruiterForm.company}
                    onChange={(e) => setNewRecruiterForm({ ...newRecruiterForm, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Role / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Talent Partner"
                    value={newRecruiterForm.title}
                    onChange={(e) => setNewRecruiterForm({ ...newRecruiterForm, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Tamil Nadu District *</label>
                  <select
                    value={newRecruiterForm.district}
                    onChange={(e) => setNewRecruiterForm({ ...newRecruiterForm, district: e.target.value })}
                  >
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City / Area</label>
                  <input
                    type="text"
                    placeholder="e.g. Guindy, OMR"
                    value={newRecruiterForm.city}
                    onChange={(e) => setNewRecruiterForm({ ...newRecruiterForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddRecruiterModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  Provision Recruiter Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Recruiter Modal */}
      {editingRecruiter && (
        <div className="modal-backdrop" onClick={() => setEditingRecruiter(null)}>
          <div className="modal-content auth-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h3 style={{ margin: 0 }}>Edit Recruiter: {editingRecruiter.name}</h3>
                <p className="auth-subtitle">Update recruiter profile, company name, office district and contact information.</p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setEditingRecruiter(null)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditRecruiter} className="auth-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Recruiter Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editRecruiterForm.name}
                    onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={editRecruiterForm.email}
                    onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={editRecruiterForm.company}
                    onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Designation / Role</label>
                  <input
                    type="text"
                    value={editRecruiterForm.title}
                    onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, title: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Office District *</label>
                  <select
                    value={editRecruiterForm.district}
                    onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, district: e.target.value })}
                  >
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>City / Industrial Area</label>
                  <input
                    type="text"
                    value={editRecruiterForm.city}
                    onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98400 12345"
                  value={editRecruiterForm.phone}
                  onChange={(e) => setEditRecruiterForm({ ...editRecruiterForm, phone: e.target.value })}
                />
              </div>

              <div className="modal-footer" style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditingRecruiter(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
                  Save Recruiter Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="modal-backdrop" onClick={() => setEditingJob(null)}>
          <div className="modal-content post-job-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="add-app-card__header">
              <div>
                <h3 style={{ margin: 0 }}>Edit Job: {editingJob.title}</h3>
                <p className="add-app-card__desc">
                  Update job requirements, district location, salary, or description.
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
                  Save Job Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
