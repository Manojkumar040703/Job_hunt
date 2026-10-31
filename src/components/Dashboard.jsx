import { useState } from "react";
import StatsCard from "./StatsCard";
import AddApplication from "./AddApplication";
import ApplicationTable from "./ApplicationTable";
import {
  IconPlus,
  IconBriefcase,
  IconSend,
  IconCalendar,
  IconCheckCircle,
  IconXCircle,
  IconSparkles,
  IconSearch,
  IconClock,
  IconMapPin,
  IconBot,
  IconBuilding,
  IconExternalLink,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

function Dashboard({
  applications = [],
  onAddApplication,
  onUpdateApplication,
  onDeleteApplication,
  onNavigate,
  interviews = [],
  jobsCount = 6,
}) {
  const { user } = useAuth();
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic calculated statistics
  const stats = {
    total: applications.length,
    applied: applications.filter((a) => (a.status || "").toLowerCase() === "applied").length,
    interview: applications.filter((a) => (a.status || "").toLowerCase() === "interview").length,
    selected: applications.filter((a) => (a.status || "").toLowerCase() === "selected").length,
    rejected: applications.filter((a) => (a.status || "").toLowerCase() === "rejected").length,
  };

  // Calculate Conversion Rate
  const conversionRate = stats.total > 0 ? Math.round((stats.interview / stats.total) * 100) : 0;
  const offerRate = stats.total > 0 ? Math.round((stats.selected / stats.total) * 100) : 0;

  function handleEditClick(indexToEdit) {
    setEditIndex(indexToEdit);
    setIsModalOpen(true);
  }

  function handleOpenAdd() {
    setEditIndex(null);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setEditIndex(null);
  }

  const nextInterview = interviews[0];

  // Tamil Nadu Key Industrial Districts
  const tnDistricts = [
    { name: "Chennai", count: 18, tag: "Tech & SaaS Hub" },
    { name: "Coimbatore", count: 9, tag: "Textile & IT" },
    { name: "Kancheepuram", count: 7, tag: "Automotive Belt" },
    { name: "Madurai", count: 5, tag: "Healthcare & IT" },
    { name: "Tiruchirappalli", count: 4, tag: "Manufacturing" },
  ];


  return (
    <main className="dashboard-layout bento-dashboard-wrapper">
      {/* =========================================================================
          BENTO GRID SYSTEM
          ========================================================================= */}
      <div className="bento-grid-container">
        
        {/* BENTO 1: Universal Platform Hero Banner (Span 8) */}
        <section className="bento-tile bento-tile--hero glass-panel">
          <div className="hero-mesh-glow" />
          <div className="hero-content-inner">
            <div className="bento-pill-tag">
              <span className="live-pulse-dot" />
              <IconSparkles size={13} />
              <span>Statewide Career & Recruitment Portal • 38 Districts</span>
            </div>

            <h1 className="bento-hero-title">
              Tamil Nadu Career & <span className="cyber-gradient-text">Recruitment Hub</span>
            </h1>

            <p className="bento-hero-desc">
              Statewide career intelligence platform connecting genuine job seekers with verified recruiters across Tamil Nadu. Currently tracking <strong>{stats.total} submissions</strong> with{" "}
              <strong className="text-highlight-cyan">{stats.interview} active interview rounds</strong> and {jobsCount}+ verified openings.
            </p>

            {/* Pipeline Stage Bar */}
            <div className="pipeline-funnel-bar">
              <div className="funnel-step">
                <span className="funnel-dot funnel-dot--applied" />
                <span className="funnel-label">Applied ({stats.applied})</span>
              </div>
              <div className="funnel-connector" />
              <div className="funnel-step">
                <span className="funnel-dot funnel-dot--interview" />
                <span className="funnel-label">Interviews ({stats.interview})</span>
              </div>
              <div className="funnel-connector" />
              <div className="funnel-step">
                <span className="funnel-dot funnel-dot--selected" />
                <span className="funnel-label">Offers ({stats.selected})</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bento-hero-actions">
              <button
                type="button"
                className="btn btn-cyber-glass"
                onClick={() => onNavigate && onNavigate("assistant")}
              >
                <IconBot size={16} /> AI Voice Assistant
              </button>

              <button
                type="button"
                className="btn btn-cyber-glass"
                onClick={() => onNavigate && onNavigate("explore")}
              >
                <IconSearch size={16} /> Browse {jobsCount}+ TN Jobs
              </button>
            </div>
          </div>
        </section>

        {/* BENTO 2: Live Interview Radar Widget (Span 4) */}
        <section className="bento-tile bento-tile--radar glass-panel">
          <div className="bento-tile__header">
            <div className="radar-header-pill">
              <span className="radar-ping-ring" />
              <IconCalendar size={15} />
              <span>INTERVIEW RADAR</span>
            </div>
            {nextInterview && (
              <span className="radar-status-badge">Next In Queue</span>
            )}
          </div>

          {nextInterview ? (
            <div className="radar-interview-details">
              <div className="company-avatar-box">
                <IconBuilding size={22} />
              </div>
              <div className="radar-interview-info">
                <h3 className="radar-company-name">{nextInterview.company}</h3>
                <p className="radar-job-role">{nextInterview.role}</p>
                <div className="radar-meta-chips">
                  <span className="meta-chip">
                    <IconClock size={12} /> {nextInterview.date} • {nextInterview.time}
                  </span>
                  <span className="meta-chip meta-chip--round">
                    {nextInterview.roundName}
                  </span>
                </div>
              </div>

              <div className="radar-action-row">
                <button
                  type="button"
                  className="btn btn-cyber-outline btn-sm w-full"
                  onClick={() => onNavigate && onNavigate("interviews")}
                >
                  <IconCalendar size={14} /> Open Meeting & Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="radar-empty-state">
              <div className="radar-empty-icon">
                <IconCalendar size={28} />
              </div>
              <h4>No Upcoming Interviews</h4>
              <p>Applications are in review. Launch AI voice prep to practice questions for Tamil Nadu engineering roles.</p>
              <button
                type="button"
                className="btn btn-cyber-glass btn-sm"
                onClick={() => onNavigate && onNavigate("assistant")}
              >
                <IconSparkles size={14} /> Practice Mock Round
              </button>
            </div>
          )}
        </section>

        {/* BENTO 3, 4, 5, 6: Four High-Impact KPI Tiles (Each Span 3) */}
        <div className="bento-kpi-row">
          <StatsCard
            title="Total Applications"
            number={stats.total}
            icon={<IconBriefcase size={22} />}
            variant="primary"
            subtitle="All active submissions"
            trend={{ label: "+14% this month", type: "positive" }}
          />

          <StatsCard
            title="Under Screening"
            number={stats.applied}
            icon={<IconSend size={22} />}
            variant="applied"
            subtitle="Recruiter reviewing"
            trend={{ label: "Avg. 2 days response", type: "neutral" }}
          />

          <StatsCard
            title="Interview Stage"
            number={stats.interview}
            icon={<IconCalendar size={22} />}
            variant="interview"
            subtitle="Technical & HR rounds"
            trend={{ label: `${conversionRate}% conversion`, type: "positive" }}
          />

          <StatsCard
            title="Offers / Selected"
            number={stats.selected}
            icon={<IconCheckCircle size={22} />}
            variant="selected"
            subtitle="Offers received"
            trend={{ label: offerRate > 0 ? `${offerRate}% offer rate` : "Active", type: "positive" }}
          />
        </div>

        {/* BENTO 7: Tamil Nadu Regional Talent Hubs (Span 7) */}
        <section className="bento-tile bento-tile--clusters glass-panel">
          <div className="bento-tile__header">
            <div>
              <span className="bento-subtitle">STATEWIDE DISTRIBUTION</span>
              <h3 className="bento-tile-title">
                <IconMapPin size={18} className="text-accent-cyan" /> Tamil Nadu District Opportunity Hubs
              </h3>
            </div>
            <button
              type="button"
              className="btn-link-action"
              onClick={() => onNavigate && onNavigate("explore")}
            >
              View 38 Districts <IconExternalLink size={13} />
            </button>
          </div>

          <div className="district-chips-grid">
            {tnDistricts.map((d) => (
              <div
                key={d.name}
                className="district-chip-card"
                onClick={() => onNavigate && onNavigate("explore")}
              >
                <div className="district-chip-top">
                  <span className="district-name">{d.name}</span>
                  <span className="district-badge">{d.count} Jobs</span>
                </div>
                <span className="district-tag">{d.tag}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BENTO 8: AI Career Voice Assistant Quick Launcher (Span 5) */}
        <section className="bento-tile bento-tile--ai-card glass-panel">
          <div className="bento-tile__header">
            <div>
              <span className="bento-subtitle">NATIVE SPEECH & ASSISTANT</span>
              <h3 className="bento-tile-title">
                <IconBot size={18} className="text-accent-indigo" /> AI Career Voice Assistant
              </h3>
            </div>
            <div className="voice-wave-indicator" title="Tamil & English Voice Recognition">
              <span className="voice-wave-bar" />
              <span className="voice-wave-bar" />
              <span className="voice-wave-bar" />
              <span className="voice-wave-bar" />
            </div>
          </div>

          <p className="ai-card-desc">
            Speak in English or Tamil to query jobs, prepare for interviews, or analyze match scores:
          </p>

          <div className="ai-prompt-pills">
            <button
              type="button"
              className="ai-prompt-pill"
              onClick={() => onNavigate && onNavigate("assistant")}
            >
              🎙️ "Find Python FastAPI roles in Chennai"
            </button>
            <button
              type="button"
              className="ai-prompt-pill"
              onClick={() => onNavigate && onNavigate("assistant")}
            >
              🚗 "Hyundai automotive embedded jobs"
            </button>
          </div>

          <button
            type="button"
            className="btn btn-cyber-primary btn-sm w-full mt-auto"
            onClick={() => onNavigate && onNavigate("assistant")}
          >
            <IconSparkles size={14} /> Launch Full Voice Console
          </button>
        </section>

        {/* BENTO 9: Main Applications Pipeline Table (Span 12 Full Width) */}
        <section className="bento-tile bento-tile--table glass-panel">
          <div className="bento-tile__header bento-tile__header--table">
            <div>
              <span className="bento-subtitle">PIPELINE MANAGER</span>
              <h3 className="bento-tile-title">
                <IconBriefcase size={18} /> Active Applications
              </h3>
            </div>
            <button
              type="button"
              className="btn btn-cyber-primary"
              onClick={handleOpenAdd}
            >
              <IconPlus size={16} /> Track Application
            </button>
          </div>

          <ApplicationTable
            applications={applications}
            onDelete={onDeleteApplication}
            onEdit={handleEditClick}
          />
        </section>

      </div>

      {/* Add / Edit Application Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content glass-panel modal-box--compact" onClick={(e) => e.stopPropagation()}>
            <AddApplication
              onAdd={(newApp) => {
                onAddApplication(newApp);
                setIsModalOpen(false);
              }}
              onUpdate={(updatedApp) => {
                onUpdateApplication(updatedApp);
                setIsModalOpen(false);
              }}
              onCancel={handleCloseModal}
              editIndex={editIndex}
              applications={applications}
              isModal={true}
            />
          </div>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
