import {
  IconDashboard,
  IconBriefcase,
  IconCalendar,
  IconSearch,
  IconUser,
  IconSparkles,
  IconBuilding,
  IconBot,
  IconShield,
  IconUsers,
  IconGraduation,
  IconMessageSquare,
  IconJobHuntLogo,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  activeTab = "dashboard",
  setActiveTab,
  applicationsCount = 0,
  interviewsCount = 0,
  openJobsCount = 5,
}) {
  const { user, selectPredefinedAccount, openRegister } = useAuth();

  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";

  // Navigation Items per role
  const candidateNavItems = [
    { id: "dashboard", label: "Home", icon: <IconDashboard size={21} /> },
    {
      id: "community",
      label: "Professional Feed",
      icon: <IconUsers size={21} />,
      badge: "Network",
      badgeType: "accent",
    },
    {
      id: "explore",
      label: "Find Jobs",
      icon: <IconSearch size={21} />,
      badge: "TN 38",
      badgeType: "accent",
    },
    {
      id: "applications",
      label: "My Applications",
      icon: <IconBriefcase size={21} />,
      badge: applicationsCount > 0 ? `${applicationsCount}` : null,
    },
    {
      id: "courses",
      label: "Courses & Certs",
      icon: <IconGraduation size={21} />,
      badge: "IIT/TN",
      badgeType: "gold",
    },
    {
      id: "assistant",
      label: "AI Career Assistant",
      icon: <IconBot size={21} />,
      badge: "Voice",
      badgeType: "gold",
    },
    {
      id: "interviews",
      label: "Interviews",
      icon: <IconCalendar size={21} />,
      badge: interviewsCount > 0 ? `${interviewsCount}` : null,
    },
    { id: "profile", label: "My Profile", icon: <IconUser size={21} /> },
  ];

  const recruiterNavItems = [
    { id: "recruiter", label: "Recruiter Hub", icon: <IconDashboard size={21} /> },
    {
      id: "community",
      label: "Talent Feed",
      icon: <IconUsers size={21} />,
      badge: "Live",
      badgeType: "accent",
    },
    {
      id: "explore",
      label: "Manage Jobs",
      icon: <IconBriefcase size={21} />,
      badge: `${openJobsCount} Active`,
    },
    {
      id: "applications",
      label: "Applicants Pipeline",
      icon: <IconUsers size={21} />,
      badge: applicationsCount > 0 ? `${applicationsCount}` : null,
    },
    {
      id: "interviews",
      label: "Scheduled Interviews",
      icon: <IconCalendar size={21} />,
      badge: interviewsCount > 0 ? `${interviewsCount}` : null,
    },
    { id: "assistant", label: "AI Candidate Search", icon: <IconBot size={21} /> },
    { id: "profile", label: "Recruiter Profile", icon: <IconUser size={21} /> },
  ];

  const adminNavItems = [
    { id: "admin", label: "Admin Console", icon: <IconShield size={21} /> },
    {
      id: "recruiter",
      label: "Recruiters",
      icon: <IconBuilding size={21} />,
      badge: "2 Active",
    },
    {
      id: "explore",
      label: "Statewide Jobs",
      icon: <IconSearch size={21} />,
      badge: `${openJobsCount}`,
    },
    {
      id: "applications",
      label: "All Applications",
      icon: <IconBriefcase size={21} />,
      badge: applicationsCount > 0 ? `${applicationsCount}` : null,
    },
    {
      id: "community",
      label: "Platform Community",
      icon: <IconUsers size={21} />,
    },
    {
      id: "courses",
      label: "Course Directory",
      icon: <IconGraduation size={21} />,
    },
    { id: "profile", label: "Admin Settings", icon: <IconUser size={21} /> },
  ];

  const navItems = isAdmin ? adminNavItems : isRecruiter ? recruiterNavItems : candidateNavItems;
  const workspaceTitle = isAdmin
    ? "ADMINISTRATOR (MANOJ)"
    : isRecruiter
    ? `RECRUITER (${(user?.name || "").toUpperCase()})`
    : `JOB SEEKER (${(user?.name || "").toUpperCase()})`;

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar__brand">
        <div className="brand-logo-icon brand-logo-icon--modern">
          <IconJobHuntLogo size={36} />
        </div>
        <div className="brand-text-block">
          <h2 className="brand-title">
            JOB<span className="brand-accent">HUNT</span>
            <span className="brand-badge-pill">TN</span>
          </h2>
          <span className="brand-sub">Career & Recruiter Portal</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar__nav">
        <span className="nav-section-title">{workspaceTitle}</span>

        <ul className="nav-list">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`nav-btn ${isActive ? "nav-btn--active" : ""}`}
                  onClick={() => setActiveTab && setActiveTab(item.id)}
                >
                  <span className="nav-btn__icon">{item.icon}</span>
                  <span className="nav-btn__label">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`nav-badge ${
                        item.badgeType === "accent"
                          ? "nav-badge--accent"
                          : item.badgeType === "gold"
                          ? "nav-badge--gold"
                          : ""
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Predefined 3 Project Personas: Job Seeker, Recruiter, and Admin */}
      <div className="sidebar__persona-switcher">
        <span className="persona-label">Switch Persona (3 Roles):</span>
        <div className="persona-pills-row">
          <button
            type="button"
            className={`persona-pill ${user?.role === "candidate" || user?.name === "Hari" ? "persona-pill--active" : ""}`}
            onClick={() => {
              selectPredefinedAccount("hari");
              setActiveTab("dashboard");
            }}
            title="Hari — Job Seeker (Demo)"
          >
            👤 Hari
          </button>
          <button
            type="button"
            className={`persona-pill ${user?.role === "recruiter" ? "persona-pill--active" : ""}`}
            onClick={() => {
              selectPredefinedAccount("raj");
              setActiveTab("recruiter");
            }}
            title="Raj — Recruiter (Apex Mobility)"
          >
            💼 Raj
          </button>
          <button
            type="button"
            className={`persona-pill ${user?.role === "admin" ? "persona-pill--active" : ""}`}
            onClick={() => {
              selectPredefinedAccount("manoj");
              setActiveTab("admin");
            }}
            title="Manoj — Platform Admin"
          >
            🛡️ Manoj
          </button>
          <button
            type="button"
            className="persona-pill"
            onClick={openRegister}
            title="Create a new Candidate or Recruiter account"
            style={{ borderStyle: "dashed", borderColor: "var(--primary)", color: "var(--primary)", fontWeight: 700 }}
          >
            + New
          </button>
        </div>
      </div>

      {/* State Geographic Verification Pill */}
      <div className="sidebar__host-pill">
        <div className="host-status-dot" />
        <div className="host-info">
          <span className="host-label">Tamil Nadu Network</span>
          <code className="host-ip">38 Districts Connected</code>
        </div>
      </div>

      {/* User Card */}
      <div className="sidebar__profile">
        <div className="sidebar-avatar-ring">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user?.name || "User"} className="sidebar-avatar-img" />
          ) : (
            <div className="profile-avatar">
              {user?.avatar || (isAdmin ? "MK" : "JH")}
            </div>
          )}
        </div>
        <div className="profile-meta">
          <span className="profile-name">{user?.name || "User"}</span>
          <span className="profile-role">
            {isAdmin
              ? "Administrator"
              : isRecruiter
              ? `Recruiter @ ${user?.company || "Company"}`
              : `${user?.district || "Tamil Nadu"} Candidate`}
          </span>
        </div>
      </div>
    </aside>
  );
}
