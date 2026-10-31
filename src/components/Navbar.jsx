import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  IconBell,
  IconSearch,
  IconUser,
  IconLogOut,
  IconLogIn,
  IconSparkles,
  IconBuilding,
  IconSun,
  IconMoon,
  IconShield,
  IconMapPin,
  IconJobHuntLogo,
} from "./Icons";

export default function Navbar({
  onNavigate,
  activeTab,
  notifications = [],
  onClearNotification,
  searchTerm = "",
  onSearchChange,
}) {
  const { user, logout, openLogin, openRegister, theme, toggleTheme, selectPredefinedAccount } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        {/* 1. Left: Mobile Brand & Regional Status Chips */}
        <div className="navbar-left">
          <div
            className="navbar-mobile-brand"
            onClick={() => onNavigate && onNavigate("dashboard")}
            style={{ cursor: "pointer" }}
            title="Job Hunt Tamil Nadu"
          >
            <IconJobHuntLogo size={28} className="brand-icon-mobile" />
            <span className="brand-name-mobile">
              JOB<span className="brand-accent">HUNT</span>
              <span className="brand-badge-pill">TN</span>
            </span>
          </div>

          <div className="navbar-badges-group">
            <div className="tn-state-pill" title="Coverage: All 38 Districts of Tamil Nadu">
              <IconMapPin size={13} />
              <span>Tamil Nadu</span>
            </div>

            <div className="live-sync-indicator" title="Live Database Connected">
              <span className="live-dot" />
              <span className="live-label">Realtime DB</span>
            </div>
          </div>
        </div>

        {/* 2. Center: Prominently Positioned Active Search Bar */}
        <div className="navbar-center">
          <form
            className="global-search-bar"
            onSubmit={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate("explore");
            }}
          >
            <IconSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search Tamil Nadu jobs, skills, companies..."
              value={searchTerm}
              onChange={(e) => {
                if (onSearchChange) onSearchChange(e.target.value);
                if (activeTab !== "explore" && onNavigate && e.target.value) {
                  onNavigate("explore");
                }
              }}
              onFocus={() => {
                if (activeTab !== "explore" && onNavigate) {
                  onNavigate("explore");
                }
              }}
            />
            {searchTerm ? (
              <button
                type="button"
                className="clear-search-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSearchChange) onSearchChange("");
                }}
                title="Clear search"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "16px",
                  lineHeight: "1",
                  padding: "2px 6px",
                }}
              >
                ×
              </button>
            ) : (
              <span className="search-shortcut-badge">Search</span>
            )}
          </form>
        </div>

        {/* 3. Right: Theme Toggle, Notifications, User Menu */}
        <div className="navbar-right">
          {/* Theme Toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <IconMoon size={17} /> : <IconSun size={17} />}
          </button>

          {/* Role Status Switcher for 3 Core People */}
          {user && (
            <div className="nav-dropdown-wrapper role-switch-container">
              <button
                type="button"
                className={`role-toggle-btn ${
                  user.role === "admin"
                    ? "role-toggle-btn--admin"
                    : user.role === "recruiter"
                    ? "role-toggle-btn--recruiter"
                    : "role-toggle-btn--candidate"
                }`}
                onClick={() => setShowRoleMenu((prev) => !prev)}
                title="Click to switch persona: Job Seeker, Recruiter, or Admin"
                style={{ cursor: "pointer", border: "none" }}
              >
                {user.role === "admin" ? (
                  <>
                    <IconShield size={14} />
                    <span>Admin: Manoj</span>
                    <span style={{ fontSize: "10px", opacity: 0.8 }}>▼</span>
                  </>
                ) : user.role === "recruiter" ? (
                  <>
                    <IconBuilding size={14} />
                    <span>Recruiter: {user.name}</span>
                    <span style={{ fontSize: "10px", opacity: 0.8 }}>▼</span>
                  </>
                ) : (
                  <>
                    <IconUser size={14} />
                    <span>Job Seeker: {user.name}</span>
                    <span style={{ fontSize: "10px", opacity: 0.8 }}>▼</span>
                  </>
                )}
              </button>

              {showRoleMenu && (
                <div className="dropdown-panel" style={{ minWidth: "220px", top: "calc(100% + 8px)", right: 0 }}>
                  <div className="dropdown-panel__header" style={{ padding: "10px 14px", borderBottom: "1px solid var(--border-light)" }}>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-main)" }}>Switch Persona (3 Roles)</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", padding: "6px" }}>
                    <button
                      type="button"
                      className={`user-menu-link ${user.role === "candidate" ? "user-menu-link--active" : ""}`}
                      onClick={() => {
                        setShowRoleMenu(false);
                        selectPredefinedAccount("hari");
                        if (onNavigate) onNavigate("dashboard");
                      }}
                      style={{ padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                    >
                      <span style={{ fontSize: "15px" }}>👤</span>
                      <div>
                        <strong style={{ display: "block", fontSize: "13px" }}>Hari (Job Seeker)</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Candidate • Full Stack Dev</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`user-menu-link ${user.role === "recruiter" ? "user-menu-link--active" : ""}`}
                      onClick={() => {
                        setShowRoleMenu(false);
                        selectPredefinedAccount("raj");
                        if (onNavigate) onNavigate("recruiter");
                      }}
                      style={{ padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                    >
                      <span style={{ fontSize: "15px" }}>💼</span>
                      <div>
                        <strong style={{ display: "block", fontSize: "13px" }}>Raj (Recruiter)</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Apex Mobility • Hiring Lead</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`user-menu-link ${user.role === "admin" ? "user-menu-link--active" : ""}`}
                      onClick={() => {
                        setShowRoleMenu(false);
                        selectPredefinedAccount("manoj");
                        if (onNavigate) onNavigate("admin");
                      }}
                      style={{ padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", textAlign: "left" }}
                    >
                      <span style={{ fontSize: "15px" }}>🛡️</span>
                      <div>
                        <strong style={{ display: "block", fontSize: "13px" }}>Manoj (Admin)</strong>
                        <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Platform Administrator</span>
                      </div>
                    </button>
                    <div style={{ borderTop: "1px solid var(--border-subtle)", marginTop: "6px", paddingTop: "6px" }}>
                      <button
                        type="button"
                        className="user-menu-link"
                        onClick={() => {
                          setShowRoleMenu(false);
                          openRegister();
                        }}
                        style={{ padding: "8px 12px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)", fontWeight: 700 }}
                      >
                        <IconSparkles size={14} />
                        <span>+ Create New Account</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications Bell */}
          <div className="nav-dropdown-wrapper">
            <button
              type="button"
              className="nav-icon-btn"
              onClick={() => setShowNotifications((prev) => !prev)}
              title="Notifications"
            >
              <IconBell size={18} />
              {unreadCount > 0 && <span className="notification-dot">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div className="dropdown-panel notifications-panel">
                <div className="dropdown-panel__header">
                  <h4>Live Notifications</h4>
                  {unreadCount > 0 && <span className="badge-count">{unreadCount} new</span>}
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <p className="empty-panel-text">No new notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item ${notif.read ? "notification-item--read" : ""}`}
                        onClick={() => onClearNotification && onClearNotification(notif.id)}
                      >
                        <div className="notification-icon">
                          <IconSparkles size={14} />
                        </div>
                        <div className="notification-content">
                          <p className="notification-title">{notif.title}</p>
                          <span className="notification-time">{notif.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Button */}
          {user ? (
            <div className="nav-dropdown-wrapper">
              <button
                type="button"
                className="user-avatar-btn"
                onClick={() => setShowUserMenu((prev) => !prev)}
              >
                <div className="avatar-circle avatar-circle--ring">
                  {user.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="nav-avatar-img" />
                  ) : (
                    user.avatar || "JH"
                  )}
                </div>
                <div className="avatar-info-hidden-mobile">
                  <span className="user-name">{user.name}</span>
                  <span className="user-title">
                    {user.role === "admin"
                      ? "Administrator"
                      : user.role === "recruiter"
                      ? user.company
                      : user.district || "Job Seeker"}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <div className="dropdown-panel user-menu-panel">
                  <div className="user-menu-header">
                    <div className="user-menu-avatar-row">
                      <div className="nav-menu-avatar-ring">
                        {user.profilePhoto ? (
                          <img src={user.profilePhoto} alt={user.name} className="nav-avatar-img" />
                        ) : (
                          <div className="avatar-circle">{user.avatar || "JH"}</div>
                        )}
                      </div>
                      <div>
                        <p className="user-menu-name">{user.name}</p>
                        <p className="user-menu-email">{user.email}</p>
                      </div>
                    </div>
                    <span className="user-menu-role-tag">
                      {user.role === "admin"
                        ? "Platform Administrator"
                        : user.role === "recruiter"
                        ? `Recruiter (${user.company})`
                        : "Candidate Profile"}
                    </span>
                  </div>

                  <div className="user-menu-links">
                    <button
                      type="button"
                      className="user-menu-link"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onNavigate) {
                          if (user.role === "admin") onNavigate("admin");
                          else if (user.role === "recruiter") onNavigate("recruiter");
                          else onNavigate("profile");
                        }
                      }}
                    >
                      <IconUser size={15} />
                      <span>
                        {user.role === "admin"
                          ? "Admin Dashboard"
                          : user.role === "recruiter"
                          ? "Recruiter Portal"
                          : "My Candidate Profile"}
                      </span>
                    </button>

                    <div className="dropdown-divider" />
                    <span className="dropdown-section-title">Switch Persona (3 Roles):</span>

                    <button
                      type="button"
                      className="user-menu-link"
                      onClick={() => {
                        setShowUserMenu(false);
                        selectPredefinedAccount("hari");
                        if (onNavigate) onNavigate("dashboard");
                      }}
                    >
                      <IconUser size={14} />
                      <span>👤 Hari (Job Seeker)</span>
                    </button>

                    <button
                      type="button"
                      className="user-menu-link"
                      onClick={() => {
                        setShowUserMenu(false);
                        selectPredefinedAccount("raj");
                        if (onNavigate) onNavigate("recruiter");
                      }}
                    >
                      <IconBuilding size={14} />
                      <span>💼 Raj (Recruiter)</span>
                    </button>

                    <button
                      type="button"
                      className="user-menu-link"
                      onClick={() => {
                        setShowUserMenu(false);
                        selectPredefinedAccount("manoj");
                        if (onNavigate) onNavigate("admin");
                      }}
                    >
                      <IconShield size={14} />
                      <span>🛡️ Manoj (Admin)</span>
                    </button>

                    <button
                      type="button"
                      className="user-menu-link"
                      onClick={() => {
                        setShowUserMenu(false);
                        openRegister();
                      }}
                      style={{ color: "var(--primary)", fontWeight: 700 }}
                    >
                      <IconSparkles size={14} />
                      <span>+ Create Another Account</span>
                    </button>

                    <div className="dropdown-divider" />

                    <button
                      type="button"
                      className="user-menu-link user-menu-link--danger"
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                    >
                      <IconLogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-buttons" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={openLogin}
                title="Sign in to your account"
              >
                <IconLogIn size={15} />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={openRegister}
                title="Create a new account"
                style={{ fontWeight: 700 }}
              >
                <IconSparkles size={14} />
                <span>+ Create Account</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
