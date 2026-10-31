import {
  IconDashboard,
  IconBriefcase,
  IconSearch,
  IconUser,
  IconBot,
  IconCalendar,
  IconUsers,
  IconShield,
  IconBuilding,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

export default function MobileBottomNav({
  activeTab = "dashboard",
  setActiveTab,
  applicationsCount = 0,
  interviewsCount = 0,
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";

  // Candidate tabs (5 items max for mobile bottom nav)
  const candidateTabs = [
    { id: "dashboard", label: "Home", icon: <IconDashboard size={20} /> },
    { id: "explore", label: "Jobs", icon: <IconSearch size={20} /> },
    { id: "assistant", label: "AI Voice", icon: <IconBot size={20} />, isVoice: true },
    { id: "community", label: "Network", icon: <IconUsers size={20} /> },
    { id: "profile", label: "Profile", icon: <IconUser size={20} /> },
  ];

  // Recruiter tabs (Raj, Ravikumar, Divya)
  const recruiterTabs = [
    { id: "recruiter", label: "Dashboard", icon: <IconDashboard size={20} /> },
    { id: "explore", label: "Jobs", icon: <IconSearch size={20} /> },
    {
      id: "applications",
      label: "Applicants",
      icon: <IconBriefcase size={20} />,
      badge: applicationsCount > 0 ? applicationsCount : null,
    },
    { id: "community", label: "Talent", icon: <IconUsers size={20} /> },
    { id: "profile", label: "Profile", icon: <IconUser size={20} /> },
  ];

  // Admin tabs (Manojkumar)
  const adminTabs = [
    { id: "admin", label: "Console", icon: <IconShield size={20} /> },
    { id: "recruiter", label: "Recruiters", icon: <IconBuilding size={20} /> },
    { id: "explore", label: "Jobs", icon: <IconSearch size={20} /> },
    { id: "community", label: "Feed", icon: <IconUsers size={20} /> },
    { id: "profile", label: "Account", icon: <IconUser size={20} /> },
  ];

  const tabs = isAdmin ? adminTabs : isRecruiter ? recruiterTabs : candidateTabs;

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav__inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`mobile-nav-btn ${isActive ? "mobile-nav-btn--active" : ""} ${
                tab.isVoice ? "mobile-nav-btn--voice" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="mobile-nav-icon-box">
                {tab.icon}
                {tab.badge && <span className="mobile-nav-badge">{tab.badge}</span>}
              </div>
              <span className="mobile-nav-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
