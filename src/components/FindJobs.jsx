import { useState } from "react";
import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconBookmark,
  IconCheckCircle,
  IconClose,
  IconFileText,
  IconSend,
  IconSparkles,
  IconClock,
  IconShield,
  IconFilter,
} from "./Icons";
import { TAMIL_NADU_DISTRICTS, JOB_CATEGORIES } from "../data/tamilNaduData";
import { useAuth } from "../context/AuthContext";

export default function FindJobs({
  jobs = [],
  appliedJobIds = [],
  onApplyJob,
  onSaveJob,
  savedJobIds = [],
  onPostJob,
  initialSearchTerm = "",
  onSearchChange,
}) {
  const { user, openLogin } = useAuth();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [districtFilter, setDistrictFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [workModeFilter, setWorkModeFilter] = useState("ALL");
  const [experienceFilter, setExperienceFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [useCustomResume, setUseCustomResume] = useState(false);
  const [customResume, setCustomResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);

  // Sync with global navbar search term if passed from parent
  useState(() => {
    if (initialSearchTerm && initialSearchTerm !== searchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  });

  const [postJobForm, setPostJobForm] = useState({
    title: "",
    company: user?.role === "recruiter" && user?.company ? user.company : "",
    district: user?.district || "Chennai",
    city: user?.city || "",
    workMode: "Hybrid",
    type: "Full-time",
    experience: "2-5 years",
    salary: "₹12,00,000 - ₹18,00,000 PA",
    category: "it",
    tags: "React, Python, SQL",
    description: "",
    requirements: "Relevant engineering degree and 2+ years hands-on experience.",
  });

  // Intelligent, multi-keyword search across all fields
  const filteredJobs = jobs.filter((job) => {
    const cleanTerm = (searchTerm || "").trim().toLowerCase();
    const searchWords = cleanTerm ? cleanTerm.split(/\s+/).filter(Boolean) : [];

    const searchableText = [
      job.title || "",
      job.company || "",
      job.district || "",
      job.city || "",
      job.location || "",
      job.category || "",
      job.workMode || "",
      job.type || "",
      job.experience || "",
      ...(job.tags || []),
      job.description || "",
      job.requirements || ""
    ].join(" ").toLowerCase();

    const matchesSearch =
      searchWords.length === 0 ||
      searchWords.every((word) => searchableText.includes(word));

    const matchesDistrict =
      districtFilter === "ALL" ||
      (job.district && job.district.toLowerCase() === districtFilter.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || job.category === categoryFilter;

    const matchesWorkMode =
      workModeFilter === "ALL" ||
      (job.workMode && job.workMode.toLowerCase() === workModeFilter.toLowerCase());

    const matchesExperience =
      experienceFilter === "ALL" ||
      (experienceFilter === "FRESHER" &&
        (job.experience?.toLowerCase().includes("fresher") ||
          job.experience?.toLowerCase().includes("0-1"))) ||
      (experienceFilter === "EXPERIENCED" &&
        !job.experience?.toLowerCase().includes("fresher"));

    return (
      matchesSearch &&
      matchesDistrict &&
      matchesCategory &&
      matchesWorkMode &&
      matchesExperience
    );
  });

  function handleOpenDetails(job) {
    setSelectedJob(job);
  }

  function handleOpenApply(job) {
    if (!user) {
      if (openLogin) openLogin();
      return;
    }
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  }

  function handleCustomResumeUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const lower = file.name.toLowerCase();
      if (!lower.endsWith(".pdf") && !lower.endsWith(".docx")) {
        alert("Please upload a PDF or DOCX resume document.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Resume file size exceeds the 5MB limit.");
        return;
      }
      setCustomResume({
        fileName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        uploadedDate: new Date().toLocaleDateString(),
      });
    }
  }

  function handleConfirmApply(e) {
    e.preventDefault();
    if (!selectedJob) return;

    const resumeToAttach = useCustomResume && customResume ? customResume : null;

    setIsSubmitting(true);
    setTimeout(() => {
      onApplyJob(selectedJob, coverNote, resumeToAttach);
      setIsSubmitting(false);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
      setCoverNote("");
      setUseCustomResume(false);
      setCustomResume(null);
    }, 400);
  }

  function resetAllFilters() {
    setSearchTerm("");
    setDistrictFilter("ALL");
    setCategoryFilter("ALL");
    setWorkModeFilter("ALL");
    setExperienceFilter("ALL");
  }

  function handleCreateNewJob(e) {
    e.preventDefault();
    if (!postJobForm.title.trim() || !postJobForm.company.trim()) {
      alert("Please provide both Job Title and Company Name.");
      return;
    }

    const createdJob = {
      id: "job-" + Date.now(),
      title: postJobForm.title.trim(),
      company: postJobForm.company.trim(),
      recruiterId: user?.id || "user-recruiter-direct",
      recruiterName: user?.name || "Direct Recruiter",
      logoColor: "#4f46e5",
      district: postJobForm.district,
      city: postJobForm.city || postJobForm.district,
      workMode: postJobForm.workMode,
      type: postJobForm.type,
      experience: postJobForm.experience,
      salary: postJobForm.salary || "Competitive",
      category: postJobForm.category,
      tags: postJobForm.tags
        ? postJobForm.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : ["Tamil Nadu", "Hiring"],
      postedDate: "Just now",
      deadline: "2026-12-31",
      status: "Active",
      description: postJobForm.description || `Exciting opportunity at ${postJobForm.company} in ${postJobForm.district}, Tamil Nadu.`,
      requirements: postJobForm.requirements
        ? postJobForm.requirements.split("\n").filter(Boolean)
        : ["Relevant professional experience.", `Location: ${postJobForm.district}, Tamil Nadu.`],
      verifiedLocation: `${postJobForm.city || postJobForm.district}, Tamil Nadu`,
    };

    if (onPostJob) {
      onPostJob(createdJob);
    }
    setIsPostJobModalOpen(false);
    setPostJobForm({
      title: "",
      company: user?.role === "recruiter" && user?.company ? user.company : "",
      district: "Chennai",
      city: "",
      workMode: "Hybrid",
      type: "Full-time",
      experience: "2-5 years",
      salary: "₹12,00,000 - ₹18,00,000 PA",
      category: "it",
      tags: "React, Python, SQL",
      description: "",
      requirements: "Relevant engineering degree and 2+ years hands-on experience.",
    });
  }

  return (
    <div className="find-jobs-view">
      {/* Tamil Nadu Search Hero */}
      <div className="jobs-hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <IconSparkles size={14} /> EXCLUSIVE TAMIL NADU CAREER DISCOVERY
          </div>
          <h1>Explore Careers Across All 38 Districts of Tamil Nadu</h1>
          <p>
            Verified opportunities in IT, Automotive EV, Textiles, Healthcare, Engineering, Banking, and Agriculture across Chennai, Coimbatore, Madurai, Salem, Tiruppur, Trichy, and statewide.
          </p>

          {/* Search Bar Bar */}
          <div className="hero-search-bar">
            {/* Search Keyword */}
            <div className="search-field">
              <IconSearch size={18} className="search-icon-hero" />
              <input
                type="text"
                placeholder="Job title, skills (Python, CAD, AUTOSAR), or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="search-divider" />

            {/* 38 District Dropdown */}
            <div className="search-field district-select-wrap">
              <IconMapPin size={18} className="search-icon-hero" />
              <select
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="hero-select"
              >
                <option value="ALL">All 38 Districts (Statewide)</option>
                {TAMIL_NADU_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-search-hero"
              onClick={() => {}}
            >
              Search TN Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="jobs-filters-bar">
        <div className="filter-selects-container">
          {/* Sector Category */}
          <div className="filter-dropdown-box">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Sectors & Industries</option>
              {JOB_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="filter-dropdown-box">
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
            >
              <option value="ALL">All Work Modes</option>
              <option value="On-site">On-site in Tamil Nadu</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote (TN Eligible)</option>
            </select>
          </div>

          {/* Experience */}
          <div className="filter-dropdown-box">
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <option value="ALL">All Experience Levels</option>
              <option value="FRESHER">Fresher / Entry Level (0-1 Yrs)</option>
              <option value="EXPERIENCED">Experienced Roles (2+ Yrs)</option>
            </select>
          </div>

          {(districtFilter !== "ALL" ||
            categoryFilter !== "ALL" ||
            workModeFilter !== "ALL" ||
            experienceFilter !== "ALL" ||
            searchTerm) && (
            <button
              type="button"
              className="btn-clear-filters"
              onClick={resetAllFilters}
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="results-actions-right">
          <div className="results-count-text">
            Showing <strong>{filteredJobs.length}</strong> verified Tamil Nadu positions
          </div>
          {user?.role === "candidate" ? (
            <span className="tn-state-pill" title="Job Seekers can apply and track status in real-time">
              👤 Job Seeker Mode • Apply & Track Status
            </span>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm btn-post-real-job"
              onClick={() => {
                if (!user) {
                  openLogin();
                } else {
                  setIsPostJobModalOpen(true);
                }
              }}
              title="Create a new verified job opening"
            >
              <IconSparkles size={14} />
              <span>+ Post Job Opening</span>
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="jobs-grid">
        {filteredJobs.length === 0 ? (
          <div className="no-jobs-card">
            <IconBriefcase size={44} />
            <h3>No jobs found matching your criteria in Tamil Nadu</h3>
            <p>Try selecting "All 38 Districts" or resetting your sector filters.</p>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetAllFilters}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const isSaved = savedJobIds.includes(job.id);

            return (
              <div key={job.id} className="job-card">
                {/* Header */}
                <div className="job-card__header">
                  <div className="job-card__brand">
                    <div
                      className="company-logo-avatar"
                      style={{ backgroundColor: job.logoColor || "#1d4ed8" }}
                    >
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h3
                        className="job-title"
                        onClick={() => handleOpenDetails(job)}
                      >
                        {job.title}
                      </h3>
                      <span className="job-company">{job.company}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`btn-bookmark ${isSaved ? "btn-bookmark--saved" : ""}`}
                    onClick={() => onSaveJob && onSaveJob(job.id)}
                    title={isSaved ? "Unsave job" : "Save job"}
                  >
                    <IconBookmark size={18} filled={isSaved} />
                  </button>
                </div>

                {/* Regional Tamil Nadu Badges */}
                <div className="job-meta-row">
                  <span className="meta-pill meta-pill--district">
                    <IconMapPin size={13} /> {job.district || job.location}{job.city ? `, ${job.city}` : ""}
                  </span>
                  <span className="meta-pill meta-pill--mode">{job.workMode}</span>
                  <span className="meta-pill meta-pill--salary">{job.salary}</span>
                  {job.experience && (
                    <span className="meta-pill">{job.experience}</span>
                  )}
                </div>

                {/* Employer Verification Stamp */}
                <div className="verified-location-banner">
                  <IconShield size={13} />
                  <span>Verified Tamil Nadu Listing • {job.verifiedLocation || `${job.district}, Tamil Nadu`}</span>
                </div>

                {/* Snippet */}
                <p className="job-snippet">{job.description}</p>

                {/* Tags */}
                <div className="job-tags-row">
                  {job.tags &&
                    job.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  {job.tags && job.tags.length > 4 && (
                    <span className="tag-more">+{job.tags.length - 4}</span>
                  )}
                </div>

                {/* Footer */}
                <div className="job-card__footer">
                  <span className="posted-time">
                    <IconClock size={13} /> {job.postedDate || "Recently"}
                  </span>

                  <div className="job-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleOpenDetails(job)}
                    >
                      View Details
                    </button>

                    {isApplied ? (
                      <span className="applied-status-badge">
                        <IconCheckCircle size={14} /> Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm btn-apply-trigger"
                        onClick={() => handleOpenApply(job)}
                      >
                        <IconSend size={14} /> 1-Click Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && !isApplyModalOpen && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div
            className="modal-content job-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="job-details-header">
              <div className="job-details-header__brand">
                <div
                  className="company-logo-avatar company-logo-avatar--lg"
                  style={{ backgroundColor: selectedJob.logoColor || "#1d4ed8" }}
                >
                  {selectedJob.company.charAt(0)}
                </div>
                <div>
                  <h2>{selectedJob.title}</h2>
                  <p className="job-details-subtitle">
                    <strong>{selectedJob.company}</strong> • {selectedJob.district || selectedJob.location} • {selectedJob.workMode}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedJob(null)}
              >
                <IconClose size={20} />
              </button>
            </div>

            <div className="job-details-meta-bar">
              <div>
                <span className="meta-label">Compensation</span>
                <span className="meta-value">{selectedJob.salary}</span>
              </div>
              <div>
                <span className="meta-label">District</span>
                <span className="meta-value">{selectedJob.district || selectedJob.location}</span>
              </div>
              <div>
                <span className="meta-label">Experience</span>
                <span className="meta-value">{selectedJob.experience || "Not specified"}</span>
              </div>
              <div>
                <span className="meta-label">Work Mode</span>
                <span className="meta-value">{selectedJob.workMode || "On-site"}</span>
              </div>
            </div>

            <div className="job-details-body">
              <div className="verified-location-card">
                <IconShield size={18} />
                <div>
                  <strong>Official Tamil Nadu Employer Verified</strong>
                  <p>{selectedJob.verifiedLocation || `${selectedJob.district}, Tamil Nadu`}</p>
                </div>
              </div>

              <section className="job-section">
                <h3>About the Opportunity</h3>
                <p>{selectedJob.description}</p>
              </section>

              {selectedJob.responsibilities && (
                <section className="job-section">
                  <h3>Key Responsibilities</h3>
                  <ul className="bullet-list">
                    {selectedJob.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </section>
              )}

              {selectedJob.requirements && (
                <section className="job-section">
                  <h3>Requirements & Eligibility</h3>
                  <ul className="bullet-list">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </section>
              )}

              {selectedJob.tags && (
                <section className="job-section">
                  <h3>Keywords & Tech Stack</h3>
                  <div className="job-tags-row">
                    {selectedJob.tags.map((tag) => (
                      <span key={tag} className="tag-pill tag-pill--lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="job-details-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>

              {appliedJobIds.includes(selectedJob.id) ? (
                <span className="applied-status-badge applied-status-badge--lg">
                  <IconCheckCircle size={16} /> Application Submitted (Track Status)
                </span>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  <IconSend size={16} /> Apply to {selectedJob.company}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Application Modal */}
      {isApplyModalOpen && selectedJob && (
        <div
          className="modal-backdrop"
          onClick={() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
          }}
        >
          <div
            className="modal-content apply-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="apply-modal-header">
              <div>
                <h3>Apply to {selectedJob.company}</h3>
                <p className="apply-modal-sub">
                  Position: <strong>{selectedJob.title}</strong> ({selectedJob.district || selectedJob.location})
                </p>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSelectedJob(null);
                }}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmApply} className="apply-form">
              {/* Applicant Profile Card */}
              <div className="applicant-profile-card">
                <div className="applicant-avatar">{user?.avatar || "TN"}</div>
                <div>
                  <h4 className="applicant-name">{user?.name || "Candidate"}</h4>
                  <p className="applicant-email">{user?.email}</p>
                  <span className="applicant-title">
                    {user?.district || "Tamil Nadu"} Candidate Profile Attached
                  </span>
                </div>
              </div>

              {/* Resume Selection */}
              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ margin: 0 }}>Application Resume (PDF or DOCX)</label>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    style={{ fontSize: "12px", padding: "2px 8px" }}
                    onClick={() => setUseCustomResume(!useCustomResume)}
                  >
                    {useCustomResume ? "↺ Use Saved Profile Resume" : "+ Upload Different Resume"}
                  </button>
                </div>

                {!useCustomResume ? (
                  <div className="attached-resume-card">
                    <IconFileText size={22} className="resume-icon" />
                    <div className="resume-info">
                      <span className="resume-name">
                        {user?.resume?.fileName || "Hari_FullStack_TN_Resume.pdf"}
                      </span>
                      <span className="resume-meta">
                        Profile Resume • {user?.resume?.fileSize || "215 KB"} • Ready
                      </span>
                    </div>
                    <span className="resume-status-tag">Profile Default</span>
                  </div>
                ) : (
                  <div className="attached-resume-card" style={{ borderStyle: "dashed" }}>
                    <IconFileText size={22} className="resume-icon" />
                    <div className="resume-info" style={{ flex: 1 }}>
                      {customResume ? (
                        <>
                          <span className="resume-name">{customResume.fileName}</span>
                          <span className="resume-meta">{customResume.fileSize} • Uploaded for this job</span>
                        </>
                      ) : (
                        <>
                          <span className="resume-name">Select PDF or DOCX file (Max 5MB)</span>
                          <span className="resume-meta">Direct upload for this specific application</span>
                        </>
                      )}
                    </div>
                    <label className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "12px", cursor: "pointer", margin: 0 }}>
                      <span>{customResume ? "Replace" : "Browse File"}</span>
                      <input
                        type="file"
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleCustomResumeUpload}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Cover Note */}
              <div className="form-group">
                <label htmlFor="coverNote">Note to Hiring Manager (Optional)</label>
                <textarea
                  id="coverNote"
                  rows={3}
                  placeholder="Introduce yourself and explain why you're a great fit for this Tamil Nadu opening..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>

              <div className="apply-form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsApplyModalOpen(false);
                    setSelectedJob(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting Application..."
                  ) : (
                    <>
                      <IconSend size={16} /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Real Job Modal */}
      {isPostJobModalOpen && (
        <div className="modal-backdrop modal-backdrop-animated" onClick={() => setIsPostJobModalOpen(false)}>
          <div className="modal-content post-job-modal-box modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <div className="auth-modal-header">
              <div className="auth-brand-row">
                <div className="app-logo-mark brand-glow-pulse">
                  <IconBriefcase size={22} />
                </div>
                <div>
                  <h3>Post a Real Job Opening</h3>
                  <p className="auth-subtitle">Publish directly to candidates across all 38 districts of Tamil Nadu.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon btn-close-modal"
                onClick={() => setIsPostJobModalOpen(false)}
              >
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewJob} className="auth-form post-job-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={postJobForm.title}
                    onChange={(e) => setPostJobForm({ ...postJobForm, title: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zoho, Freshworks, Tata, Startup"
                    value={postJobForm.company}
                    onChange={(e) => setPostJobForm({ ...postJobForm, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Tamil Nadu District *</label>
                  <select
                    value={postJobForm.district}
                    onChange={(e) => setPostJobForm({ ...postJobForm, district: e.target.value })}
                  >
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>City / Campus Area</label>
                  <input
                    type="text"
                    placeholder="e.g. OMR / Sriperumbudur / Peelamedu"
                    value={postJobForm.city}
                    onChange={(e) => setPostJobForm({ ...postJobForm, city: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Work Mode</label>
                  <select
                    value={postJobForm.workMode}
                    onChange={(e) => setPostJobForm({ ...postJobForm, workMode: e.target.value })}
                  >
                    <option value="On-site">On-site in TN</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="form-group">
                  <label>Sector / Category</label>
                  <select
                    value={postJobForm.category}
                    onChange={(e) => setPostJobForm({ ...postJobForm, category: e.target.value })}
                  >
                    {JOB_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    placeholder="e.g. 2-5 years or Fresher Friendly"
                    value={postJobForm.experience}
                    onChange={(e) => setPostJobForm({ ...postJobForm, experience: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Annual CTC / Salary</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12,00,000 - ₹18,00,000 PA"
                    value={postJobForm.salary}
                    onChange={(e) => setPostJobForm({ ...postJobForm, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Key Skills & Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Python, FastAPI, React, PostgreSQL, Docker"
                  value={postJobForm.tags}
                  onChange={(e) => setPostJobForm({ ...postJobForm, tags: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Role Summary & Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe key responsibilities and impact of this role..."
                  value={postJobForm.description}
                  onChange={(e) => setPostJobForm({ ...postJobForm, description: e.target.value })}
                />
              </div>

              <div className="apply-form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsPostJobModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <IconSparkles size={16} /> Publish Real Job Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
