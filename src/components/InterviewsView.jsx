import { useState } from "react";
import {
  IconCalendar,
  IconClock,
  IconBuilding,
  IconUser,
  IconExternalLink,
  IconPlus,
  IconClose,
  IconCheckCircle,
} from "./Icons";

function InterviewsView({ interviews = [], onScheduleInterview }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    roundName: "Technical Interview",
    date: "",
    time: "",
    interviewers: "",
    platform: "Google Meet",
    meetUrl: "https://meet.google.com/sample-room",
    notes: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.company || !formData.date) return;

    onScheduleInterview({
      id: "int-" + Date.now(),
      ...formData,
      status: "Upcoming",
    });

    setIsModalOpen(false);
    setFormData({
      company: "",
      role: "",
      roundName: "Technical Interview",
      date: "",
      time: "",
      interviewers: "",
      platform: "Google Meet",
      meetUrl: "https://meet.google.com/sample-room",
      notes: "",
    });
  }

  return (
    <div className="interviews-view">
      <div className="dashboard-header">
        <div>
          <h1>Scheduled Interview Rounds</h1>
          <p>Prepare for upcoming technical screenings, system design rounds, and hiring manager chats.</p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          <IconPlus size={16} /> Schedule Interview
        </button>
      </div>

      <div className="interviews-grid">
        {interviews.length === 0 ? (
          <div className="table-empty-state">
            <IconCalendar size={40} />
            <h3>No interviews scheduled</h3>
            <p>When an application advances to the interview stage, your rounds will appear here.</p>
          </div>
        ) : (
          interviews.map((int) => (
            <div key={int.id} className="interview-card">
              <div className="interview-card__header">
                <div className="interview-card__brand">
                  <div className="company-avatar" style={{ background: "#e0f2fe", color: "#0284c7" }}>
                    {int.company.charAt(0)}
                  </div>
                  <div>
                    <h4>{int.company}</h4>
                    <span className="interview-role">{int.role}</span>
                  </div>
                </div>

                <span className="status-badge status--interview">
                  {int.status || "Upcoming"}
                </span>
              </div>

              <div className="interview-round-box">
                <span className="round-badge">{int.roundName}</span>
              </div>

              <div className="interview-details-list">
                <div className="int-detail-item">
                  <IconCalendar size={16} />
                  <span><strong>Date:</strong> {int.date}</span>
                </div>
                <div className="int-detail-item">
                  <IconClock size={16} />
                  <span><strong>Time:</strong> {int.time || "Scheduled"}</span>
                </div>
                {int.interviewers && (
                  <div className="int-detail-item">
                    <IconUser size={16} />
                    <span><strong>Panel:</strong> {int.interviewers}</span>
                  </div>
                )}
              </div>

              {int.notes && (
                <p className="interview-notes">
                  <strong>Prep Notes:</strong> {int.notes}
                </p>
              )}

              <div className="interview-card__footer">
                <span className="platform-name">{int.platform || "Video Call"}</span>
                {int.meetUrl && (
                  <a
                    href={int.meetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Join Room</span>
                    <IconExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Interview Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="add-app-card__header">
              <div>
                <h3>Schedule New Interview Round</h3>
                <p className="add-app-card__desc">Add date, meeting room link, and preparation notes.</p>
              </div>
              <button type="button" className="btn-icon" onClick={() => setIsModalOpen(false)}>
                <IconClose size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="add-app-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Google"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Position *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Interview Round</label>
                  <input
                    type="text"
                    placeholder="e.g. Round 2: System Design & Coding"
                    value={formData.roundName}
                    onChange={(e) => setFormData({ ...formData, roundName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 3:00 PM - 4:00 PM IST"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Meeting URL</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={formData.meetUrl}
                    onChange={(e) => setFormData({ ...formData, meetUrl: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Interviewers (Names / Titles)</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera (Tech Lead), David Kim (Eng Manager)"
                    value={formData.interviewers}
                    onChange={(e) => setFormData({ ...formData, interviewers: e.target.value })}
                  />
                </div>

                <div className="form-group form-group--full">
                  <label>Preparation Focus & Checklist</label>
                  <textarea
                    rows={2}
                    placeholder="Review React concurrency, Redis caching, past projects..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewsView;
