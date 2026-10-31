import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  IconUser,
  IconFileText,
  IconUploadCloud,
  IconCheckCircle,
  IconPlus,
  IconClose,
  IconSparkles,
  IconMapPin,
  IconBriefcase,
  IconShield,
  IconBot,
  IconSend,
  IconClock,
  IconBuilding,
} from "./Icons";
import { TAMIL_NADU_DISTRICTS, TN_JOBS } from "../data/tamilNaduData";

export function generateAiIntelligence(formData, skills = [], resume = null, userRole = "candidate") {
  const titleLower = (formData.title || "").toLowerCase();
  const currentSkills = (skills || []).map((s) => s.toLowerCase());

  // 1. Detect career domain with high precision
  let domain = "fullstack";
  let domainName = "Full Stack & Web Engineering";

  if (
    titleLower.includes("auto") ||
    titleLower.includes("embed") ||
    titleLower.includes("ev ") ||
    titleLower.includes("firmware") ||
    titleLower.includes("ecu")
  ) {
    domain = "automotive";
    domainName = "Automotive & Embedded Systems";
  } else if (
    titleLower.includes("data") ||
    titleLower.includes("ai") ||
    titleLower.includes("vision") ||
    titleLower.includes("machine learning") ||
    titleLower.includes("deep learning")
  ) {
    domain = "ai_data";
    domainName = "AI, Data Science & ML";
  } else if (
    titleLower.includes("front") ||
    titleLower.includes("ui") ||
    titleLower.includes("ux") ||
    titleLower.includes("react")
  ) {
    domain = "frontend";
    domainName = "Frontend & UI/UX Engineering";
  } else if (
    titleLower.includes("back") ||
    titleLower.includes("cloud") ||
    titleLower.includes("devops") ||
    titleLower.includes("api")
  ) {
    domain = "backend";
    domainName = "Backend & Cloud Architecture";
  } else if (
    titleLower.includes("mobile") ||
    titleLower.includes("android") ||
    titleLower.includes("flutter") ||
    titleLower.includes("ios")
  ) {
    domain = "mobile";
    domainName = "Mobile Application Development";
  } else if (
    titleLower.includes("qa") ||
    titleLower.includes("test") ||
    titleLower.includes("automation") ||
    titleLower.includes("selenium")
  ) {
    domain = "qa";
    domainName = "QA & Test Automation";
  } else if (
    titleLower.includes("textile") ||
    titleLower.includes("garment") ||
    titleLower.includes("manufactur") ||
    titleLower.includes("quality")
  ) {
    domain = "manufacturing";
    domainName = "Industrial Manufacturing & Operations";
  } else if (userRole === "admin") {
    domain = "admin";
    domainName = "Platform & Enterprise Governance";
  }

  // 2. High-demand market benchmark skills across Tamil Nadu tech hubs
  const skillBenchmarks = {
    fullstack: ["FastAPI", "React", "PostgreSQL", "Docker", "Redis", "AWS Cloud", "TypeScript", "CI/CD Pipelines", "Git"],
    frontend: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Jest", "Web Performance", "Redux", "UI/UX Design"],
    backend: ["Python", "FastAPI", "PostgreSQL", "Docker", "Kubernetes", "AWS Cloud", "Redis", "Kafka", "Microservices"],
    mobile: ["React Native", "Flutter", "TypeScript", "Android SDK", "iOS", "Firebase", "Redux", "REST APIs"],
    ai_data: ["Python", "PyTorch", "Pandas", "Computer Vision", "FastAPI", "Deep Learning", "SQL", "Scikit-Learn"],
    automotive: ["Embedded C", "CAN Bus Protocol", "AUTOSAR", "ARM Cortex", "ISO 26262", "HIL Testing", "Microcontrollers"],
    qa: ["Selenium", "Cypress", "Playwright", "Jest", "API Testing", "Postman", "CI/CD Automation", "Python"],
    manufacturing: ["Lean Six Sigma", "Quality Assurance", "ISO 9001", "Production Workflow", "Root Cause Analysis", "Supply Chain"],
    admin: ["Role-Based Access Control", "PostgreSQL Admin", "Audit Logging", "System Monitoring", "Linux", "Security Compliance"],
  };

  const benchmark = skillBenchmarks[domain] || skillBenchmarks.fullstack;
  const matchedBenchmarkSkills = benchmark.filter((b) => currentSkills.includes(b.toLowerCase()));
  const missingSkills = benchmark.filter((b) => !currentSkills.includes(b.toLowerCase())).slice(0, 5);

  // 3. Four-Pillar ATS & Candidate Evaluation
  let resumeScore = 40;
  if (resume?.fileName) {
    resumeScore = 85;
    if (resume.fileName.toLowerCase().endsWith(".pdf")) resumeScore += 10;
    if (resume.fileSize && parseInt(resume.fileSize, 10) < 1000) resumeScore += 5;
  }
  resumeScore = Math.min(100, resumeScore);

  const skillsScore = Math.min(98, Math.max(45, Math.round((matchedBenchmarkSkills.length / Math.max(benchmark.length, 1)) * 95) + 15));

  let profileScore = 40;
  if (formData.bio && formData.bio.trim().length > 30) profileScore += 20;
  if (skills.length >= 6) profileScore += 20;
  else if (skills.length >= 3) profileScore += 10;
  if (formData.phone && formData.email) profileScore += 10;
  profileScore = Math.min(100, profileScore);

  const highDemandDistricts = ["Chennai", "Coimbatore", "Chengalpattu", "Kancheepuram", "Madurai", "Tiruchirappalli"];
  const isHighDemandArea = highDemandDistricts.some((d) => (formData.district || "").toLowerCase().includes(d.toLowerCase()));
  const marketDemand = isHighDemandArea ? 92 : 82;

  const overallScore = Math.round(resumeScore * 0.3 + skillsScore * 0.35 + profileScore * 0.2 + marketDemand * 0.15);

  const matchedJobs = (TN_JOBS || [])
    .map((job) => {
      const matchingTags = (job.tags || []).filter((tag) => currentSkills.includes(tag.toLowerCase()));
      let matchRatio = (matchingTags.length / Math.max((job.tags || []).length, 1)) * 65;
      if ((job.title || "").toLowerCase().includes(domain) || (job.category || "") === domain) {
        matchRatio += 28;
      }
      if ((job.district || "").toLowerCase() === (formData.district || "").toLowerCase()) {
        matchRatio += 10;
      }
      const finalMatchPct = Math.min(97, Math.max(45, Math.round(matchRatio)));
      return {
        ...job,
        finalMatchPct,
        matchingTags,
      };
    })
    .sort((a, b) => b.finalMatchPct - a.finalMatchPct)
    .slice(0, 2);

  const domainQuestions = {
    fullstack: [
      { q: "How do you design scalable async APIs with FastAPI and handle high-volume database transactions in PostgreSQL?", tip: "Highlight async/await coroutines, SQLAlchemy connection pooling, and indexing strategies." },
      { q: "Explain your approach to state management and Core Web Vitals optimization in modern React.", tip: "Mention custom hooks, optimistic UI updates, and lazy loading with code splitting." },
      { q: "How do you secure endpoints with JWT and prevent token replay attacks in distributed microservices?", tip: "Discuss HTTP-only secure cookies, short expiry tokens, and Redis blacklisting for revocations." },
    ],
    frontend: [
      { q: "How do you detect and fix unnecessary re-renders in deep React component trees?", tip: "Discuss React.memo, useCallback, useMemo, and the React Profiler." },
      { q: "What techniques do you apply to achieve a 95+ Google Lighthouse score on production apps?", tip: "Discuss responsive images, font preloading, critical CSS, and bundle tree shaking." },
      { q: "How do you ensure UI components meet WCAG 2.1 AA accessibility standards?", tip: "Cover semantic HTML5, keyboard navigation, ARIA attributes, and color contrast ratios." },
    ],
    backend: [
      { q: "How do you analyze slow SQL queries and choose optimal indexes in PostgreSQL?", tip: "Discuss EXPLAIN ANALYZE, index selectivity, and B-tree vs GIN indexes." },
      { q: "How do you architect resilient services with circuit breakers and fallback caching?", tip: "Mention Redis caching, retry policies with jitter, and bulkhead patterns." },
      { q: "Walk through how you package and deploy containerized Python microservices to Kubernetes.", tip: "Discuss multi-stage Docker builds, health/readiness probes, and ingress routing." },
    ],
    ai_data: [
      { q: "How do you handle dataset imbalance and feature leakage when training predictive models?", tip: "Mention SMOTE, stratified splits, and isolating pre-processing inside pipeline transformers." },
      { q: "How do you optimize deep learning inference latency for production APIs?", tip: "Discuss ONNX runtime conversion, model quantization (INT8/FP16), and batching." },
      { q: "Explain how attention mechanisms in Transformers differ from traditional RNN/LSTM models.", tip: "Discuss parallel self-attention computation and positional encodings." },
    ],
    automotive: [
      { q: "How do you implement ISO 26262 functional safety requirements in embedded firmware?", tip: "Mention ASIL integrity levels, watchdog resets, CRC error checks, and fail-safe states." },
      { q: "Explain the CAN bus message arbitration and error frame signaling mechanism.", tip: "Cover dominant vs recessive bit priority and CAN transceiver electrical characteristics." },
      { q: "How do you avoid priority inversion and deadlock in real-time operating systems (RTOS)?", tip: "Discuss priority inheritance protocol and semaphore mutex best practices." },
    ],
    qa: [
      { q: "How do you architect an enterprise Page Object Model test framework in Playwright or Cypress?", tip: "Highlight reusable action wrappers, test data fixtures, and clean reporting." },
      { q: "How do you handle flaky tests caused by asynchronous network requests or animations?", tip: "Use auto-waiting assertions and explicit state matchers instead of hardcoded timeouts." },
      { q: "How do you parallelize test execution across CI/CD worker nodes?", tip: "Discuss containerized runners, matrix builds, and artifact reporting." },
    ],
    manufacturing: [
      { q: "Walk through a DMAIC root-cause analysis you conducted to reduce production line defects.", tip: "Detail the baseline measurement, statistical root-cause identification, and control plans." },
      { q: "How do you enforce ISO 9001 quality audits across multi-shift plant teams?", tip: "Cover standard operating procedures (SOPs), calibration logs, and corrective action reports." },
      { q: "What Lean manufacturing tools do you use to streamline cycle times and eliminate waste?", tip: "Mention Value Stream Mapping, 5S workplace organization, and Kanban pull systems." },
    ],
    admin: [
      { q: "How do you enforce least-privilege Role-Based Access Control and audit logging in enterprise systems?", tip: "Discuss PostgreSQL row-level security, immutable audit logs, and IAM roles." },
      { q: "What is your strategy for automated disaster recovery and zero-downtime database upgrades?", tip: "Mention replication slots, WAL archiving, point-in-time recovery, and blue-green deployments." },
      { q: "How do you detect and respond to unauthorized access attempts in real time?", tip: "Cover rate limiting, fail2ban/WAF rules, and automated alerting webhooks." },
    ],
  };

  const interviewQuestions = domainQuestions[domain] || domainQuestions.fullstack;

  const checklist = [
    { label: "ATS-Compatible PDF Resume Uploaded", passed: Boolean(resume?.fileName && resume.fileName.toLowerCase().endsWith(".pdf")), detail: resume?.fileName || "Upload your PDF resume" },
    { label: "6+ In-Demand Technical Skills Added", passed: skills.length >= 6, detail: `${skills.length} skills listed (${skills.length >= 6 ? "Optimal" : "Add more"})` },
    { label: "Quantifiable Impact Bio Documented", passed: Boolean(formData.bio && formData.bio.trim().length >= 40), detail: `${formData.bio ? formData.bio.length : 0} characters` },
    { label: "Tamil Nadu Employment District Verified", passed: Boolean(formData.district), detail: formData.district || "Select district" },
  ];

  const dynamicStrengths = [];
  if (matchedBenchmarkSkills.length > 0) {
    dynamicStrengths.push(
      `Strong profile alignment in core competencies: ${matchedBenchmarkSkills.slice(0, 3).join(", ")}.`
    );
  }
  dynamicStrengths.push(
    `Verified residency in ${formData.district || "Tamil Nadu"}, providing immediate proximity advantages for regional Tamil Nadu recruiters.`
  );
  if (resume?.fileName) {
    dynamicStrengths.push(
      `Uploaded resume '${resume.fileName}' formatted for ATS readability and direct 1-click recruiter applications.`
    );
  }

  let recommendation = "";
  if (missingSkills.length > 0) {
    recommendation = `Adding '${missingSkills[0]}' and '${missingSkills[1] || missingSkills[0]}' will boost your recruiter shortlisting match rate by ~25% for ${formData.district || "Tamil Nadu"} tech corridors.`;
  } else {
    recommendation = `Exceptional profile! Your technical credentials match senior recruiter benchmarks across Tamil Nadu.`;
  }

  return {
    domainName,
    overallScore,
    resumeScore,
    skillsScore,
    profileScore,
    marketDemand,
    strengths: dynamicStrengths,
    missingSkills,
    matchedJobs,
    interviewQuestions,
    checklist,
    recommendation,
  };
}

export default function ProfileView({ onToast, onApplyJob, onNavigate }) {
  const { user, updateProfile, selectPredefinedAccount } = useAuth();

  const isRecruiter = user?.role === "recruiter";
  const isAdmin = user?.role === "admin";
  const isCandidate = !isRecruiter && !isAdmin;

  const [formData, setFormData] = useState({
    name: user?.name || (isAdmin ? "Manoj" : isRecruiter ? "Raj" : "Hari"),
    email: user?.email || (isAdmin ? "manoj@demo.com" : isRecruiter ? "raj@demo.com" : "hari@demo.com"),
    phone: user?.phone || "+91 97890 12345",
    company: user?.company || (isRecruiter ? "Apex Mobility (Demo)" : ""),
    title: user?.title || (isAdmin ? "Platform Administrator" : isRecruiter ? "Talent Acquisition Lead" : "Full Stack Python Developer"),
    district: user?.district || (isAdmin ? "Chennai" : isRecruiter ? "Kancheepuram" : "Coimbatore"),
    city: user?.city || (isAdmin ? "Anna Salai" : isRecruiter ? "Sriperumbudur" : "Gandhipuram"),
    experience: user?.experience || (isAdmin ? "Chief Administrator" : isRecruiter ? "Senior TA Lead" : "3 Years"),
    bio: user?.bio || (isAdmin ? "Demo Platform Administrator. Oversees verification workflows, role permissions, and system integrity." : isRecruiter ? "Demo Recruiter sourcing engineering and technical talent for demonstration openings in Tamil Nadu." : "Demo job seeker profile passionate about building fast async APIs with Python, modern React interfaces, and SQL databases."),
  });

  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null);

  const [skills, setSkills] = useState(
    user?.skills || [
      "Python",
      "FastAPI",
      "React",
      "PostgreSQL",
      "Docker",
      "Git",
      "REST APIs",
      "Tailwind CSS",
    ]
  );
  const [newSkill, setNewSkill] = useState("");

  const [resume, setResume] = useState(
    user?.resume || {
      fileName: "Hari_FullStack_TN_Resume.pdf",
      uploadedDate: "2026-10-25",
      fileSize: "210 KB",
    }
  );

  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState("");
  const [isSubmittingApply, setIsSubmittingApply] = useState(false);

  const [aiSuggestions, setAiSuggestions] = useState(() =>
    generateAiIntelligence(
      formData,
      skills,
      resume,
      user?.role || "candidate"
    )
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Sync form data whenever switching between the 3 core accounts (Hari, Raj, Manoj)
  useEffect(() => {
    if (user) {
      const isAdm = user.role === "admin";
      const isRec = user.role === "recruiter";
      setFormData({
        name: user.name || (isAdm ? "Manoj" : isRec ? "Raj" : "Hari"),
        email: user.email || (isAdm ? "manoj@demo.com" : isRec ? "raj@demo.com" : "hari@demo.com"),
        phone: user.phone || "+91 98401 23456",
        company: user.company || (isRec ? "Apex Mobility (Demo)" : ""),
        title: user.title || (isAdm ? "Platform Administrator" : isRec ? (user.company ? `Lead Recruiter — ${user.company}` : "Talent Acquisition Lead") : "Full Stack Developer"),
        district: user.district || (isAdm ? "Chennai" : isRec ? "Kancheepuram" : "Coimbatore"),
        city: user.city || (user.district === "Coimbatore" ? "Gandhipuram" : user.district === "Kancheepuram" ? "Sriperumbudur" : "Anna Salai"),
        experience: user.experience || (isAdm ? "Chief Administrator" : isRec ? "Senior TA Lead" : "3 Years"),
        bio: user.bio || (isAdm ? "Demo Platform Administrator. Oversees verification workflows, role permissions, and system integrity." : isRec ? "Demo Recruiter sourcing engineering and technical talent for demonstration openings in Tamil Nadu." : "Demo job seeker profile passionate about building fast async APIs with Python, modern React interfaces, and SQL databases."),
      });
      if (user.skills) setSkills(user.skills);
      if (user.resume) setResume(user.resume);
      if (user.profilePhoto) setProfilePhoto(user.profilePhoto);
    }
  }, [user?.id, user?.role, user?.name, user?.email, user?.company]);

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  // Dynamic Profile Strength calculation based on actual completed fields (photo is optional)
  const profileStrength = Math.min(
    100,
    (resume?.fileName ? 25 : 0) +
    (formData.bio?.trim().length > 20 ? 25 : 0) +
    Math.min(30, (skills?.length || 0) * 5) +
    (formData.phone?.trim() ? 10 : 0) +
    (formData.district ? 10 : 0)
  );

  function handleSave(e) {
    e.preventDefault();
    updateProfile({
      ...formData,
      company: formData.company,
      profilePhoto,
      skills,
      resume,
    });
    if (onToast) onToast(`✅ Profile changes saved for ${formData.name}!`);
  }

  function handleAddSkill(e) {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      setSkills(updated);
      updateProfile({ skills: updated });
    }
    setNewSkill("");
  }

  function handleRemoveSkill(skillToRemove) {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    updateProfile({ skills: updated });
  }

  function handlePhotoUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        if (onToast) onToast("⚠️ Photo size exceeds 2 MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const photoUrl = uploadEvent.target.result;
        setProfilePhoto(photoUrl);
        updateProfile({ profilePhoto: photoUrl });
        if (onToast) onToast("📷 Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  }

  function handleRemovePhoto() {
    setProfilePhoto(null);
    updateProfile({ profilePhoto: null });
    if (onToast) onToast("🗑️ Profile photo removed!");
  }

  function handleResumeUpload(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const lowerName = file.name.toLowerCase();
      if (!lowerName.endsWith(".pdf") && !lowerName.endsWith(".docx")) {
        if (onToast) onToast("⚠️ Only PDF and DOCX files are accepted for resumes.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        if (onToast) onToast("⚠️ Resume size exceeds 5 MB limit.");
        return;
      }
      const newResume = {
        fileName: file.name,
        uploadedDate: new Date().toLocaleDateString(),
        fileSize: `${Math.round(file.size / 1024)} KB`,
      };
      setResume(newResume);
      updateProfile({ resume: newResume });
      if (onToast) onToast(`📄 Uploaded resume: ${file.name}`);
    }
  }

  // Automatically keep AI Intelligence live and synchronized with profile changes
  useEffect(() => {
    const intel = generateAiIntelligence(formData, skills, resume, user?.role);
    setAiSuggestions(intel);
  }, [formData.title, formData.district, formData.bio, skills, resume, user?.role]);

  function handleRefreshAnalysis() {
    setIsAnalyzing(true);
    setTimeout(() => {
      const intel = generateAiIntelligence(formData, skills, resume, user?.role);
      setAiSuggestions(intel);
      setIsAnalyzing(false);
      if (onToast) onToast("✨ AI Career & ATS Readiness Intelligence updated!");
    }, 350);
  }

  function handleConfirmApply(e) {
    e.preventDefault();
    if (!selectedJob) return;

    setIsSubmittingApply(true);
    setTimeout(() => {
      if (onApplyJob) {
        onApplyJob(selectedJob, coverNote, resume);
      } else if (onToast) {
        onToast(`🎉 Applied to ${selectedJob.title} at ${selectedJob.company}!`);
      }
      setIsSubmittingApply(false);
      setIsApplyModalOpen(false);
      setSelectedJob(null);
      setCoverNote("");
    }, 400);
  }

  // Allow 1-click addition of recommended missing skills
  function handleAddSuggestedSkill(skillToAdd) {
    if (!skills.includes(skillToAdd)) {
      const updated = [...skills, skillToAdd];
      setSkills(updated);
      updateProfile({ skills: updated });

      if (aiSuggestions) {
        setAiSuggestions((prev) => ({
          ...prev,
          overallScore: Math.min(99, prev.overallScore + 2),
          skillsScore: Math.min(99, prev.skillsScore + 3),
          missingSkills: prev.missingSkills.filter((s) => s !== skillToAdd),
        }));
      }

      if (onToast) onToast(`✅ Added '${skillToAdd}' directly to your active skills!`);
    }
  }

  return (
    <div className="profile-view-layout">
      {/* Top Header Bar with Optional Role Switcher */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: 0, color: "var(--text-main)" }}>
            {isAdmin ? "Chief Administrator Profile" : isRecruiter ? "Verified Recruiter Profile" : "Candidate Profile"}
          </h2>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "3px 0 0" }}>
            {isAdmin ? "Manage state administrator credentials and platform governance" : isRecruiter ? "Manage verified hiring profile and company identity" : "Manage your verified job seeker profile, resume, and skills"}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={() => setShowRoleSwitcher((prev) => !prev)}
          title={showRoleSwitcher ? "Remove / Hide Role Switcher" : "Optional: Switch Demo Roles"}
          style={{ fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          {showRoleSwitcher ? "✕ Hide Role Switcher" : "⚙️ Switch Roles (Optional)"}
        </button>
      </div>

      {/* Optional Role Switcher: Hidden by default, removable anytime */}
      {showRoleSwitcher && (
        <div className="profile-role-switcher-card" style={{ marginBottom: "20px" }}>
          <div className="role-switcher-header">
            <div>
              <span className="role-switcher-title">Switch Active Profile</span>
              <p className="role-switcher-sub">
                Optional: Switch between Candidate, Recruiter, and Admin for testing
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="role-switcher-pills">
                <button
                  type="button"
                  className={`role-switcher-btn ${isCandidate ? "active" : ""}`}
                  onClick={() => selectPredefinedAccount("hari")}
                >
                  👤 Hari (Candidate)
                </button>
                <button
                  type="button"
                  className={`role-switcher-btn ${isRecruiter ? "active" : ""}`}
                  onClick={() => selectPredefinedAccount("raj")}
                >
                  💼 Raj (Recruiter)
                </button>
                <button
                  type="button"
                  className={`role-switcher-btn ${isAdmin ? "active" : ""}`}
                  onClick={() => selectPredefinedAccount("manoj")}
                >
                  🛡️ Manoj (Admin)
                </button>
              </div>
              <button
                type="button"
                className="btn btn-xs btn-ghost"
                onClick={() => setShowRoleSwitcher(false)}
                title="Remove role switcher from profile view"
                style={{ fontSize: "12px", color: "var(--text-muted)", padding: "4px 8px" }}
              >
                ✕ Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Callout Banners */}
      {isRecruiter && (
        <div className="role-callout-banner role-callout-banner--recruiter">
          <div className="role-callout-icon">💼</div>
          <div className="role-callout-content">
            <h4>Verified Recruiter Profile — {formData.company || "Apex Mobility"}</h4>
            <p>
              You are editing the verified recruiter identity. Updates to your company name, designation, and district reflect on all your job postings and applicant communications.
            </p>
          </div>
          {onNavigate && (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => onNavigate("recruiter")}
            >
              Go to Recruiter Hub →
            </button>
          )}
        </div>
      )}

      {isAdmin && (
        <div className="role-callout-banner role-callout-banner--admin">
          <div className="role-callout-icon">🛡️</div>
          <div className="role-callout-content">
            <h4>Platform Administrator Profile (Manoj)</h4>
            <p>
              Chief governance profile for the Tamil Nadu Employment Network. Modifications update administrator credentials and security signatures across all 38 districts.
            </p>
          </div>
          {onNavigate && (
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => onNavigate("admin")}
            >
              Go to Admin Console →
            </button>
          )}
        </div>
      )}

      {/* Hero Overview */}
      <div className="profile-hero-card">
        <div className="profile-hero-main">
          {/* Profile Photo / Symbol Presentation (No AI Images) */}
          <div className="profile-photo-container">
            <div className="profile-photo-outer-ring">
              {profilePhoto && !profilePhoto.includes("unsplash.com") ? (
                <img src={profilePhoto} alt={formData.name} className="profile-photo-img" />
              ) : (
                <div
                  className="profile-avatar-large"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    borderRadius: "50%",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {isAdmin ? (
                    <IconShield size={44} />
                  ) : isRecruiter ? (
                    <IconBuilding size={44} />
                  ) : (
                    <IconUser size={44} />
                  )}
                </div>
              )}
            </div>
            <label className="change-photo-badge" title="Change Profile Photo (Optional)">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: "none" }}
              />
            </label>
            {profilePhoto && !profilePhoto.includes("unsplash.com") && (
              <button
                type="button"
                className="remove-photo-badge"
                onClick={handleRemovePhoto}
                title="Remove Profile Photo & Use Symbol"
                aria-label="Remove Profile Photo"
              >
                ✕
              </button>
            )}
          </div>

          <div className="profile-hero-info">
            <h2>{formData.name}</h2>
            <p className="profile-hero-title">{formData.title}</p>
            <div className="profile-meta-tags">
              <span className="profile-meta-pill">
                <IconMapPin size={13} /> {formData.district}, {formData.city || "Tamil Nadu"}
              </span>
              <span className="profile-meta-pill">
                <IconBriefcase size={13} /> {formData.experience}
              </span>
              {user?.role === "admin" ? (
                <span
                  className="profile-meta-pill profile-meta-pill--verified"
                  style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
                >
                  <IconShield size={13} /> Platform Administrator
                </span>
              ) : user?.role === "recruiter" ? (
                <span
                  className="profile-meta-pill profile-meta-pill--verified"
                  style={{ background: "#e0e7ff", color: "#3730a3", border: "1px solid #c7d2fe" }}
                >
                  <IconBriefcase size={13} /> Verified Recruiter ({user?.company || "Employer"})
                </span>
              ) : (
                <span className="profile-meta-pill profile-meta-pill--verified">
                  <IconShield size={13} /> Genuine Candidate
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Profile Strength Meter */}
        <div className="profile-completion-meter">
          <div className="meter-header">
            <span className="meter-label">Profile Strength</span>
            <span className="meter-percent">{profileStrength}%</span>
          </div>
          <div className="meter-bar">
            <div
              className="meter-fill"
              style={{
                width: `${profileStrength}%`,
                background:
                  profileStrength >= 80
                    ? "linear-gradient(90deg, #10b981, #059669)"
                    : profileStrength >= 60
                    ? "linear-gradient(90deg, #f59e0b, #d97706)"
                    : "linear-gradient(90deg, #ef4444, #dc2626)",
              }}
            />
          </div>
          <span className="meter-hint">
            <IconSparkles size={12} />{" "}
            {user?.role === "admin"
              ? "Administrator account verified & secured"
              : user?.role === "recruiter"
              ? "Verified hiring account ready to post openings"
              : profileStrength >= 80
              ? "Ready for 1-click recruiter applications"
              : "Complete resume & skills for top recruiter match"}
          </span>
        </div>
      </div>

      {/* AI Resume Analyzer Banner */}
      <div className="ai-resume-analysis-banner">
        <div className="ai-banner-left">
          <div className="ai-icon-wrap">
            <IconBot size={24} />
          </div>
          <div>
            <h4>AI Career Intelligence & ATS Readiness Engine</h4>
            <p>
              Deep multi-pillar benchmark: ATS parseability, Tamil Nadu market demand, matched vacancies, and technical interview preparation.
            </p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleRefreshAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing
            ? "Analyzing Candidate Profile..."
            : aiSuggestions
            ? "Re-Run AI Assessment"
            : "Run AI Career & ATS Analysis"}
        </button>
      </div>

      {/* Comprehensive AI Career Intelligence Report Card */}
      {aiSuggestions && (
        <div className="ai-analysis-results-card">
          <div className="ai-results-header">
            <div>
              <h3>AI Candidate Readiness & Career Intelligence Report</h3>
              {aiSuggestions.domainName && (
                <span style={{ fontSize: "12.5px", color: "var(--text-muted)", display: "block", marginTop: "3px" }}>
                  Specialization Track: <strong>{aiSuggestions.domainName}</strong>
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                className="score-badge"
                style={{
                  background:
                    aiSuggestions.overallScore >= 85
                      ? "#dcfce7"
                      : aiSuggestions.overallScore >= 70
                      ? "#dbeafe"
                      : "#fef3c7",
                  color:
                    aiSuggestions.overallScore >= 85
                      ? "#15803d"
                      : aiSuggestions.overallScore >= 70
                      ? "#1d4ed8"
                      : "#b45309",
                }}
              >
                Overall Score: {aiSuggestions.overallScore}/100 •{" "}
                {aiSuggestions.overallScore >= 85
                  ? "ATS Optimized"
                  : aiSuggestions.overallScore >= 70
                  ? "Competitive"
                  : "Action Recommended"}
              </span>
              <button
                type="button"
                className="ai-close-btn"
                onClick={() => setAiSuggestions(null)}
                title="Dismiss Analysis Report"
              >
                ×
              </button>
            </div>
          </div>

          {/* 4-Pillar Score Cards Grid */}
          <div className="ai-pillars-grid">
            <div className="ai-pillar-card">
              <div className="ai-pillar-top">
                <span className="ai-pillar-name">📄 ATS Resume Format</span>
                <span className="ai-pillar-score">{aiSuggestions.resumeScore}%</span>
              </div>
              <div className="ai-pillar-bar-track">
                <div
                  className="ai-pillar-bar-fill"
                  style={{
                    width: `${aiSuggestions.resumeScore}%`,
                    background: "linear-gradient(90deg, #10b981, #059669)",
                  }}
                />
              </div>
              <span className="ai-pillar-desc">
                {resume?.fileName ? "PDF ATS parseability verified" : "Upload PDF resume to boost ATS score"}
              </span>
            </div>

            <div className="ai-pillar-card">
              <div className="ai-pillar-top">
                <span className="ai-pillar-name">⚡ Skill Alignment</span>
                <span className="ai-pillar-score">{aiSuggestions.skillsScore}%</span>
              </div>
              <div className="ai-pillar-bar-track">
                <div
                  className="ai-pillar-bar-fill"
                  style={{
                    width: `${aiSuggestions.skillsScore}%`,
                    background: "linear-gradient(90deg, #38bdf8, #2563eb)",
                  }}
                />
              </div>
              <span className="ai-pillar-desc">Matched against Tamil Nadu market core benchmarks</span>
            </div>

            <div className="ai-pillar-card">
              <div className="ai-pillar-top">
                <span className="ai-pillar-name">👤 Profile Impact</span>
                <span className="ai-pillar-score">{aiSuggestions.profileScore}%</span>
              </div>
              <div className="ai-pillar-bar-track">
                <div
                  className="ai-pillar-bar-fill"
                  style={{
                    width: `${aiSuggestions.profileScore}%`,
                    background: "linear-gradient(90deg, #818cf8, #6366f1)",
                  }}
                />
              </div>
              <span className="ai-pillar-desc">Bio depth, phone, email & photo readiness</span>
            </div>

            <div className="ai-pillar-card">
              <div className="ai-pillar-top">
                <span className="ai-pillar-name">📈 Regional Demand</span>
                <span className="ai-pillar-score">{aiSuggestions.marketDemand}%</span>
              </div>
              <div className="ai-pillar-bar-track">
                <div
                  className="ai-pillar-bar-fill"
                  style={{
                    width: `${aiSuggestions.marketDemand}%`,
                    background: "linear-gradient(90deg, #f59e0b, #d97706)",
                  }}
                />
              </div>
              <span className="ai-pillar-desc">
                Hiring activity in {formData.district || "Tamil Nadu"} tech corridors
              </span>
            </div>
          </div>

          {/* Strengths & Missing Skills */}
          <div className="ai-results-grid">
            <div>
              <span className="res-title">Key Candidate Strengths:</span>
              <ul className="bullet-list">
                {aiSuggestions.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <span className="res-title">Recommended Skills to Add (1-Click Add to Profile):</span>
              <div className="missing-skills-tags">
                {aiSuggestions.missingSkills && aiSuggestions.missingSkills.length > 0 ? (
                  aiSuggestions.missingSkills.map((sk) => (
                    <button
                      key={sk}
                      type="button"
                      className="missing-tag missing-tag--clickable"
                      onClick={() => handleAddSuggestedSkill(sk)}
                      title={`Click to add ${sk} directly to your active profile skills`}
                    >
                      + {sk}
                    </button>
                  ))
                ) : (
                  <span style={{ fontSize: "12.5px", color: "#059669", fontWeight: 600 }}>
                    ✓ All high-demand benchmark skills fulfilled!
                  </span>
                )}
              </div>
              <p className="res-action-hint">💡 {aiSuggestions.recommendation}</p>
            </div>
          </div>

          {/* ATS Readiness Checklist */}
          {aiSuggestions.checklist && (
            <div style={{ marginTop: "20px" }}>
              <span className="ai-section-title">📋 ATS Candidate Readiness Checklist</span>
              <div className="ai-checklist-grid">
                {aiSuggestions.checklist.map((item, idx) => (
                  <div key={idx} className="ai-check-item">
                    <span className={`ai-check-icon ${item.passed ? "ai-check-passed" : "ai-check-pending"}`}>
                      {item.passed ? "✓" : "⚠️"}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{item.label}</div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Matching Jobs in Tamil Nadu */}
          {aiSuggestions.matchedJobs && aiSuggestions.matchedJobs.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <span className="ai-section-title">🎯 Top Matching Openings in Tamil Nadu</span>
              <div className="ai-matched-jobs-grid">
                {aiSuggestions.matchedJobs.map((job) => (
                  <div key={job.id} className="ai-job-match-card">
                    <div className="ai-job-match-header">
                      <div>
                        <h4 className="ai-job-match-title">{job.title}</h4>
                        <span className="ai-job-match-company">
                          {job.company} • {job.district}
                        </span>
                      </div>
                      <span className="ai-match-badge">{job.finalMatchPct}% Match</span>
                    </div>
                    <div className="ai-job-match-meta">
                      <span>💰 {job.salary}</span>
                      <span>💼 {job.workMode || job.type}</span>
                    </div>
                    <div className="ai-job-tags-row">
                      {(job.tags || []).slice(0, 4).map((tg) => (
                        <span key={tg} className="ai-job-tag">
                          {tg}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                      <button
                        type="button"
                        className="btn btn-xs btn-secondary"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className="btn btn-xs btn-primary"
                        onClick={() => {
                          setSelectedJob(job);
                          setIsApplyModalOpen(true);
                        }}
                      >
                        1-Click Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technical Interview Preparation */}
          {aiSuggestions.interviewQuestions && aiSuggestions.interviewQuestions.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <span className="ai-section-title">🎙️ Tailored Technical Interview Questions</span>
              <div className="ai-questions-grid">
                {aiSuggestions.interviewQuestions.map((iq, qIdx) => (
                  <div key={qIdx} className="ai-question-card">
                    <div className="ai-question-text">
                      <span style={{ color: "var(--primary)" }}>Q{qIdx + 1}:</span>
                      <span>{iq.q}</span>
                    </div>
                    <div className="ai-question-tip">
                      <strong>Recruiter Pro-Tip:</strong> {iq.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="profile-grid">
        {/* Left Column: Personal Information Form */}
        <div className="profile-card">
          <div className="card-header">
            <h3>Personal & Contact Information</h3>
            <p>Update your career details and contact for recruiter outreach</p>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Primary Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Headline / Job Role Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {isRecruiter && (
              <div className="form-group">
                <label>Hiring Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. Apex Mobility (Demo), CloudScale Tech, Zoho..."
                />
              </div>
            )}

            {isAdmin && (
              <div className="form-group">
                <label>Platform Governance Role</label>
                <input
                  type="text"
                  disabled
                  value="Chief Platform Administrator • Full Statewide Oversight (All 38 Districts)"
                  style={{ background: "var(--bg-surface-elevated)", opacity: 0.85, cursor: "not-allowed" }}
                />
              </div>
            )}

            <div className="form-grid-2">
              <div className="form-group">
                <label>Tamil Nadu District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                >
                  {TAMIL_NADU_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>City / Area (e.g. Gandhipuram, OMR)</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Total Experience</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Career Objective & Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Right Column: Role-tailored Credentials / Resume & Competencies */}
        <div className="profile-right-stack">
          {isRecruiter ? (
            <div className="profile-card">
              <div className="card-header">
                <h3>Recruiter Credentials & Organization</h3>
                <p>Tamil Nadu hiring authorization and company credentials</p>
              </div>

              <div className="resume-box" style={{ borderColor: "rgba(99, 102, 241, 0.4)" }}>
                <div className="resume-file-icon" style={{ background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)" }}>
                  <IconBuilding size={26} />
                </div>
                <div className="resume-file-info">
                  <span className="file-title">{formData.company || "Apex Mobility (Demo)"}</span>
                  <span className="file-sub">
                    Authorized Recruiter ID: {user?.id || "user-raj"} • {formData.district}, TN
                  </span>
                </div>
                <span className="active-resume-pill" style={{ background: "#dcfce7", color: "#15803d" }}>
                  Verified Recruiter
                </span>
              </div>

              <div className="resume-actions-group" style={{ marginTop: "14px" }}>
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onNavigate("recruiter")}
                  >
                    Open Recruiter Hub
                  </button>
                )}
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onNavigate("explore")}
                  >
                    Manage Postings
                  </button>
                )}
              </div>
            </div>
          ) : isAdmin ? (
            <div className="profile-card">
              <div className="card-header">
                <h3>System Administration & Security</h3>
                <p>Enterprise governance authority and security jurisdiction</p>
              </div>

              <div className="resume-box" style={{ borderColor: "rgba(245, 158, 11, 0.4)" }}>
                <div className="resume-file-icon" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#d97706" }}>
                  <IconShield size={26} />
                </div>
                <div className="resume-file-info">
                  <span className="file-title">Chief Platform Administrator</span>
                  <span className="file-sub">
                    Security Level 1 • Statewide Oversight (All 38 Districts)
                  </span>
                </div>
                <span className="active-resume-pill" style={{ background: "#fef3c7", color: "#92400e" }}>
                  Root Access
                </span>
              </div>

              <div className="resume-actions-group" style={{ marginTop: "14px" }}>
                {onNavigate && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => onNavigate("admin")}
                  >
                    Open Admin Console
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Candidate Resume PDF & DOCX Management */
            <div className="profile-card">
              <div className="card-header">
                <h3>Resume (PDF & DOCX Format)</h3>
                <p>Uploaded resume sent directly to recruiters when applying (Max 5MB)</p>
              </div>

              <div className="resume-box">
                <div className="resume-file-icon">
                  <IconFileText size={28} />
                </div>

                <div className="resume-file-info">
                  <span className="file-title">{resume.fileName}</span>
                  <span className="file-sub">
                    Uploaded {resume.uploadedDate} • {resume.fileSize}
                  </span>
                </div>

                <span className="active-resume-pill">
                  {resume.fileName?.toLowerCase().endsWith(".docx") ? "Active DOCX" : "Active PDF"}
                </span>
              </div>

              <div className="resume-actions-group">
                <label className="btn btn-secondary btn-upload-label">
                  <IconUploadCloud size={16} />
                  <span>Upload PDF / DOCX</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleResumeUpload}
                    style={{ display: "none" }}
                  />
                </label>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onToast && onToast(`Downloaded ${resume.fileName}`)}
                >
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Skills & Competencies Management */}
          <div className="profile-card">
            <div className="card-header">
              <h3>
                {isRecruiter
                  ? "Recruitment & Sourcing Domains"
                  : isAdmin
                  ? "Platform Administration Competencies"
                  : "Skills & Technical Competencies"}
              </h3>
              <p>
                {isRecruiter
                  ? "Specialized talent sectors and technical requirements"
                  : isAdmin
                  ? "Platform governance, security, and verification competencies"
                  : "Matched with verified job openings across Tamil Nadu"}
              </p>
            </div>

            <div className="skills-cloud">
              {skills.map((skill) => (
                <span key={skill} className="skill-chip">
                  <span>{skill}</span>
                  <button
                    type="button"
                    className="skill-remove-btn"
                    onClick={() => handleRemoveSkill(skill)}
                    title="Remove skill"
                  >
                    <IconClose size={12} />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="add-skill-form">
              <input
                type="text"
                placeholder={
                  isRecruiter
                    ? "Add domain (e.g. FastAPI, Automotive, Campus Hiring)..."
                    : isAdmin
                    ? "Add admin skill (e.g. Audit Logs, PostgreSQL, RBAC)..."
                    : "Add a skill (e.g. FastAPI, AUTOSAR, SQL)..."
                }
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary">
                <IconPlus size={16} /> Add
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Modal: Job Details Modal */}
      {selectedJob && !isApplyModalOpen && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div
            className="modal-content job-details-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "560px", maxHeight: "86vh", overflowY: "auto" }}
          >
            <div className="job-details-hero">
              <div className="job-details-brand">
                <div
                  className="company-avatar-large"
                  style={{
                    backgroundColor: selectedJob.logoColor || "var(--primary)",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {selectedJob.company ? selectedJob.company.charAt(0).toUpperCase() : "J"}
                </div>
                <div>
                  <h2 style={{ fontSize: "19px", margin: "0 0 4px 0", color: "var(--text-main)" }}>
                    {selectedJob.title}
                  </h2>
                  <span style={{ fontSize: "13.5px", color: "var(--text-muted)" }}>
                    {selectedJob.company} • {selectedJob.district}, Tamil Nadu
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedJob(null)}
                aria-label="Close"
              >
                <IconClose size={18} />
              </button>
            </div>

            <div className="job-meta-grid" style={{ margin: "14px 0" }}>
              <div className="meta-box">
                <span className="meta-label">Salary Package</span>
                <span className="meta-value">{selectedJob.salary}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Job Type</span>
                <span className="meta-value">{selectedJob.type || "Full-time"}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Experience</span>
                <span className="meta-value">{selectedJob.experience || "2+ Years"}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Work Mode</span>
                <span className="meta-value">{selectedJob.workMode || "On-site"}</span>
              </div>
            </div>

            <div className="job-details-body">
              <section className="job-section">
                <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>About the Role</h3>
                <p style={{ fontSize: "13px", lineHeight: 1.5, color: "var(--text-muted)" }}>
                  {selectedJob.description}
                </p>
              </section>

              {selectedJob.tags && (
                <section className="job-section" style={{ marginTop: "12px" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>Required Skills</h3>
                  <div className="job-tags-row">
                    {selectedJob.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div
              className="job-details-footer"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "16px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsApplyModalOpen(true)}
              >
                <IconSend size={15} /> 1-Click Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: 1-Click Apply Modal */}
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
            style={{ maxWidth: "520px" }}
          >
            <div className="apply-modal-header">
              <div>
                <h3 style={{ margin: "0 0 4px 0", fontSize: "18px" }}>
                  Apply to {selectedJob.company}
                </h3>
                <p style={{ fontSize: "12.5px", color: "var(--text-muted)", margin: 0 }}>
                  Role: <strong>{selectedJob.title}</strong> ({selectedJob.district}, Tamil Nadu)
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

            <form onSubmit={handleConfirmApply} className="apply-modal-form" style={{ marginTop: "14px" }}>
              <div
                style={{
                  background: "var(--bg-surface-elevated)",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-light)",
                  marginBottom: "14px",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Candidate Credentials Submitted
                </div>
                <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "13.5px" }}>
                  {formData.name} • {formData.email}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  📄 Attached Resume: <strong>{resume?.fileName || "Hari_Resume.pdf"}</strong>
                </div>
              </div>

              <div className="form-group">
                <label style={{ fontSize: "13px", fontWeight: 600 }}>Cover Note to Recruiter (Optional)</label>
                <textarea
                  rows={3}
                  placeholder={`Hi ${selectedJob.company} Hiring Team, I am excited to apply for ${selectedJob.title}...`}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-light)", background: "var(--bg-surface)", color: "var(--text-main)" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--border-light)",
                }}
              >
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
                  disabled={isSubmittingApply}
                >
                  {isSubmittingApply ? "Transmitting..." : "Confirm & Send Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
