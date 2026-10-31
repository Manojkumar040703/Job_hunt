import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  IconClose,
  IconUser,
  IconBuilding,
  IconShield,
  IconSparkles,
  IconCheckCircle,
  IconBriefcase,
  IconJobHuntLogo,
} from "./Icons";
import { TAMIL_NADU_DISTRICTS } from "../data/tamilNaduData";

export default function AuthModal({ isForced = false }) {
  const {
    user,
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    selectPredefinedAccount,
  } = useAuth();

  const [registerRole, setRegisterRole] = useState("candidate"); // "candidate" | "recruiter"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    district: "Chennai",
    city: "",
    title: "",
    skills: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Only hide if user exists and modal is closed
  if (!isAuthModalOpen && !isForced && user) return null;

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (authModalMode === "login") {
      if (!formData.email) {
        setError("Please enter your registered email address");
        return;
      }
      setIsSubmitting(true);
      setTimeout(() => {
        const res = login(formData.email, formData.password, registerRole);
        setIsSubmitting(false);
        if (res && !res.success) {
          setError(res.error || "Invalid credentials. Please verify your email or use a 1-click test account.");
        } else {
          setSuccessMsg("✅ Authentication successful! Entering platform...");
          setTimeout(() => {
            closeAuthModal();
          }, 400);
        }
      }, 500);
    } else {
      if (!formData.name.trim()) {
        setError("Full Name is required");
        return;
      }
      if (!formData.email.trim()) {
        setError("Email address is required");
        return;
      }
      if (registerRole === "recruiter" && !formData.company.trim()) {
        setError("Company / Organization Name is required for Recruiters");
        return;
      }

      setIsSubmitting(true);
      setTimeout(() => {
        register({
          ...formData,
          role: registerRole,
        });
        setIsSubmitting(false);
        setSuccessMsg("🎉 Account registered successfully! Entering platform...");
        setTimeout(() => {
          closeAuthModal();
        }, 400);
      }, 500);
    }
  }

  return (
    <div
      className={`modal-backdrop modal-backdrop-animated ${!user ? "modal-backdrop--mandatory" : ""}`}
      onClick={() => user && !isForced && closeAuthModal()}
    >
      <div
        className="modal-content auth-modal-box auth-modal-glass"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Job Hunt Brand */}
        <div className="auth-modal-header">
          <div className="auth-brand-row">
            <div className="app-logo-mark brand-glow-pulse" style={{ background: "transparent", padding: 0 }}>
              <IconJobHuntLogo size={36} />
            </div>
            <div>
              <h3>
                {authModalMode === "login"
                  ? "Sign In to Job Hunt"
                  : registerRole === "recruiter"
                  ? "Employer & Recruiter Registration"
                  : "Candidate & Job Seeker Registration"}
              </h3>
              <p className="auth-subtitle">
                {authModalMode === "login"
                  ? "Access verified jobs, AI voice coaching & recruiter management across Tamil Nadu."
                  : registerRole === "recruiter"
                  ? "Post verified openings across all 38 districts & hire qualified Tamil Nadu talent."
                  : "Create your verified profile & apply to top companies in Tamil Nadu."}
              </p>
            </div>
          </div>
          {user && !isForced && (
            <button
              type="button"
              className="btn-icon btn-close-modal"
              onClick={closeAuthModal}
              title="Close"
            >
              <IconClose size={18} />
            </button>
          )}
        </div>

        {/* Top Primary Auth Mode Switcher: Sign In vs Create Account */}
        <div className="auth-mode-segmented">
          <button
            type="button"
            className={`auth-mode-btn ${authModalMode === "login" ? "auth-mode-btn--active" : ""}`}
            onClick={() => {
              setAuthModalMode("login");
              setError("");
              setSuccessMsg("");
            }}
          >
            🔑 Sign In
          </button>
          <button
            type="button"
            className={`auth-mode-btn ${authModalMode === "register" ? "auth-mode-btn--active" : ""}`}
            onClick={() => {
              setAuthModalMode("register");
              setError("");
              setSuccessMsg("");
            }}
          >
            ✨ Create New Account
          </button>
        </div>

        {/* 1-Click Demo Accounts Quick Selector (shown during login) */}
        {authModalMode === "login" && (
          <>
            <div className="predefined-accounts-card">
              <div className="predefined-title-row">
                <span className="predefined-label">⚡ 1-Click Demo Accounts:</span>
                <span className="badge-official">3 Core Roles</span>
              </div>
              <div className="predefined-grid predefined-grid--three">
                <button
                  type="button"
                  className="btn-predefined-account btn-predefined-account--candidate"
                  onClick={() => {
                    selectPredefinedAccount("hari");
                    closeAuthModal();
                  }}
                >
                  <div className="predefined-avatar">H</div>
                  <div className="predefined-info">
                    <strong>Hari</strong>
                    <span>Full Stack Developer</span>
                  </div>
                  <span className="role-tag-mini role-tag-mini--candidate">Job Seeker</span>
                </button>

                <button
                  type="button"
                  className="btn-predefined-account btn-predefined-account--recruiter"
                  onClick={() => {
                    selectPredefinedAccount("raj");
                    closeAuthModal();
                  }}
                >
                  <div className="predefined-avatar">R</div>
                  <div className="predefined-info">
                    <strong>Raj</strong>
                    <span>Apex Mobility HR</span>
                  </div>
                  <span className="role-tag-mini role-tag-mini--recruiter">Recruiter</span>
                </button>

                <button
                  type="button"
                  className="btn-predefined-account btn-predefined-account--admin"
                  onClick={() => {
                    selectPredefinedAccount("manoj");
                    closeAuthModal();
                  }}
                >
                  <div className="predefined-avatar">M</div>
                  <div className="predefined-info">
                    <strong>Manoj</strong>
                    <span>Platform Administrator</span>
                  </div>
                  <span className="role-tag-mini role-tag-mini--admin">Admin</span>
                </button>
              </div>
            </div>

            {/* Prompt for users without an account */}
            <div className="auth-no-account-callout">
              <div>
                <strong>Don't have an account yet?</strong>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>
                  Create your free Job Seeker or Recruiter account in seconds.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => {
                  setAuthModalMode("register");
                  setError("");
                }}
              >
                + Create Account
              </button>
            </div>
          </>
        )}

        {/* Role Switcher for Registration */}
        {authModalMode === "register" && (
          <div className="auth-role-tabs">
            <button
              type="button"
              className={`auth-role-tab ${registerRole === "candidate" ? "auth-role-tab--active" : ""}`}
              onClick={() => {
                setRegisterRole("candidate");
                setError("");
              }}
            >
              <IconUser size={16} />
              <span>Job Seeker (Candidate)</span>
            </button>
            <button
              type="button"
              className={`auth-role-tab ${registerRole === "recruiter" ? "auth-role-tab--active" : ""}`}
              onClick={() => {
                setRegisterRole("recruiter");
                setError("");
              }}
            >
              <IconBuilding size={16} />
              <span>Employer (Recruiter)</span>
            </button>
          </div>
        )}

        <div className="auth-divider">
          <span>
            {authModalMode === "login"
              ? "or sign in with email & password"
              : `register as new ${registerRole === "recruiter" ? "recruiter / company" : "candidate"}`}
          </span>
        </div>

        {/* Error banner */}
        {error && <div className="auth-error-banner">{error}</div>}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {authModalMode === "register" && (
            <>
              {/* Recruiter vs Candidate Row 1 */}
              {registerRole === "recruiter" ? (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="auth-name">Recruiter Contact Name *</label>
                    <input
                      id="auth-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Priya Natarajan"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="auth-company">Company / Enterprise *</label>
                    <input
                      id="auth-company"
                      name="company"
                      type="text"
                      required
                      placeholder="e.g. Zoho, TVS Motor, Tech Startup"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="auth-name">Full Name *</label>
                    <input
                      id="auth-name"
                      name="name"
                      type="text"
                      required
                      placeholder="e.g. Arunachalam Murugavel"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="auth-phone">Contact Number *</label>
                    <input
                      id="auth-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+91 98400 12345"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {/* District & City */}
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="auth-district">
                    {registerRole === "recruiter" ? "Office District *" : "Tamil Nadu District *"}
                  </label>
                  <select
                    id="auth-district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                  >
                    {TAMIL_NADU_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="auth-city">City / Industrial Area</label>
                  <input
                    id="auth-city"
                    name="city"
                    type="text"
                    placeholder={
                      registerRole === "recruiter"
                        ? "e.g. OMR, Sriperumbudur, Peelamedu"
                        : "e.g. Velachery, Gandhipuram"
                    }
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Recruiter extra fields */}
              {registerRole === "recruiter" ? (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="auth-title">Designation / Role</label>
                    <input
                      id="auth-title"
                      name="title"
                      type="text"
                      placeholder="e.g. HR Lead / Talent Acquisition"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="auth-phone">Contact Phone</label>
                    <input
                      id="auth-phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98400 12345"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ) : (
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="auth-title">Target Role / Headline</label>
                    <input
                      id="auth-title"
                      name="title"
                      type="text"
                      placeholder="e.g. Full Stack Python Developer"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="auth-skills">Key Skills</label>
                    <input
                      id="auth-skills"
                      name="skills"
                      type="text"
                      placeholder="e.g. Python, React, SQL, Docker"
                      value={formData.skills}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Email & Password in 2-column grid during registration, stacked during login */}
          {authModalMode === "register" ? (
            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="auth-email">
                  {registerRole === "recruiter" ? "Work Email Address *" : "Email Address *"}
                </label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  placeholder={
                    registerRole === "recruiter"
                      ? "priya@company.com"
                      : "arun@example.com"
                  }
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password *</label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="auth-email">Registered Email Address *</label>
                <input
                  id="auth-email"
                  name="email"
                  type="email"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="auth-password">Password *</label>
                <input
                  id="auth-password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {error && (
            <div className="auth-alert-box auth-alert-box--error" role="alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          {successMsg && (
            <div className="auth-alert-box auth-alert-box--success" role="alert">
              <span>{successMsg}</span>
            </div>
          )}

          {/* Dedicated High-Visibility Submit Button */}
          <div className="auth-submit-container" style={{ marginTop: "16px" }}>
            <button
              id="btn-auth-submit"
              type="submit"
              className="btn btn-primary btn-block btn-auth-submit btn-lg"
              disabled={isSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "14px 20px",
                fontSize: "15px",
                fontWeight: 700,
                borderRadius: "10px",
                boxShadow: "0 4px 14px rgba(79, 70, 229, 0.35)",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-inline" />
                  <span>Processing...</span>
                </>
              ) : authModalMode === "login" ? (
                <>
                  <IconSparkles size={18} />
                  <span>Sign In to Job Hunt</span>
                </>
              ) : registerRole === "recruiter" ? (
                <>
                  <IconBuilding size={18} />
                  <span>Submit & Start Hiring as Recruiter</span>
                </>
              ) : (
                <>
                  <IconCheckCircle size={18} />
                  <span>Submit Registration as Candidate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Toggle */}
        <div className="auth-modal-footer">
          {authModalMode === "login" ? (
            <div className="auth-footer-prompt">
              <span>Don't have an account yet?</span>
              <div className="auth-footer-links">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    setError("");
                    setRegisterRole("candidate");
                    setAuthModalMode("register");
                  }}
                >
                  Register as Candidate
                </button>
                <span className="dot-sep">•</span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    setError("");
                    setRegisterRole("recruiter");
                    setAuthModalMode("register");
                  }}
                >
                  Register as Recruiter
                </button>
              </div>
            </div>
          ) : (
            <p>
              Already registered?{" "}
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setError("");
                  setAuthModalMode("login");
                }}
              >
                Sign In to existing account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
