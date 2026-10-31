import { useState } from "react";
import {
  IconSearch,
  IconFilter,
  IconEdit,
  IconTrash,
  IconBriefcase,
  IconMapPin,
  IconCheckCircle,
  IconXCircle,
  IconSend,
  IconCalendar,
  IconPlus,
  IconSparkles,
} from "./Icons";

export function StatusBadge({ status }) {
  const normStatus = (status || "applied").toLowerCase();

  let badgeClass = "status--applied";
  let icon = <IconSend size={13} />;

  if (normStatus.includes("review")) {
    badgeClass = "status--review";
    icon = <IconSearch size={13} />;
  } else if (normStatus.includes("shortlist")) {
    badgeClass = "status--shortlist";
    icon = <IconSparkles size={13} />;
  } else if (normStatus.includes("interview")) {
    badgeClass = "status--interview";
    icon = <IconCalendar size={13} />;
  } else if (normStatus.includes("selected") && !normStatus.includes("not")) {
    badgeClass = "status--selected";
    icon = <IconCheckCircle size={13} />;
  } else if (normStatus.includes("not") || normStatus.includes("reject")) {
    badgeClass = "status--rejected";
    icon = <IconXCircle size={13} />;
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      {icon}
      <span className="status-badge__text">{status || "Applied"}</span>
    </span>
  );
}

export default function ApplicationTable({
  applications = [],
  onDelete,
  onEdit,
  onOpenAddModal,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);

  // Multi-field intelligent search and flexible status filter
  const filteredApplications = applications.filter((app) => {
    const term = (searchTerm || "").trim().toLowerCase();
    const searchWords = term ? term.split(/\s+/).filter(Boolean) : [];

    const searchableText = [
      app.company || "",
      app.role || "",
      app.location || "",
      app.salary || "",
      app.status || "",
      app.notes || "",
    ].join(" ").toLowerCase();

    const matchesSearch =
      searchWords.length === 0 ||
      searchWords.every((word) => searchableText.includes(word));

    const appStatusNorm = (app.status || "").toLowerCase();
    const matchesStatus =
      filterStatus === "ALL" ||
      appStatusNorm === filterStatus.toLowerCase() ||
      (filterStatus === "Interview Scheduled" && appStatusNorm.includes("interview")) ||
      (filterStatus === "Under Review" && (appStatusNorm.includes("review") || appStatusNorm.includes("screening")));

    return matchesSearch && matchesStatus;
  });

  function handleDeleteClick(originalIndex) {
    setDeleteConfirmIndex(originalIndex);
  }

  function confirmDelete(originalIndex) {
    if (onDelete) {
      const targetApp = applications[originalIndex];
      onDelete(targetApp?.id || originalIndex);
    }
    setDeleteConfirmIndex(null);
  }

  const selectedApps = applications.filter(
    (a) => (a.status || "").toLowerCase() === "selected"
  );

  return (
    <div className="application-table app-table-container">
      {/* Selected Candidate Celebration Banner */}
      {selectedApps.length > 0 && (
        <div className="selection-celebration-banner">
          <div className="celebration-icon">🎉</div>
          <div>
            <h4>Congratulations! You have been Selected</h4>
            <p>
              You received an official selection offer for{" "}
              <strong>{selectedApps[0].role}</strong> at{" "}
              <strong>{selectedApps[0].company}</strong>! Check your registered email for offer details.
            </p>
          </div>
        </div>
      )}

      {/* Table Toolbar */}
      <div className="table-toolbar">
        <div className="table-toolbar__title-group">
          <h2>My Job Applications</h2>
          <span className="badge-count">
            {filteredApplications.length} of {applications.length}
          </span>
        </div>

        <div className="table-toolbar__controls">
          {/* Search Box */}
          <div className="search-input-box">
            <IconSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search company, role, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="filter-select-box">
            <IconFilter size={15} className="filter-icon" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Not Selected">Not Selected</option>
            </select>
          </div>

          {onOpenAddModal && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAddModal}
            >
              <IconPlus size={15} /> Track Application
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {applications.length === 0 ? (
        <div className="table-empty-state">
          <div className="empty-state__icon-box">
            <IconBriefcase size={36} />
          </div>
          <h3>No applications submitted yet</h3>
          <p>
            Explore verified Tamil Nadu openings and 1-click apply to track your progress here.
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="table-empty-state table-empty-state--filtered">
          <h3>No applications match your filter</h3>
          <p>Try refining your search keyword or clearing the status filter.</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("ALL");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th style={{ width: "24%" }}>Company</th>
                <th style={{ width: "26%" }}>Job Role</th>
                <th style={{ width: "18%" }}>Location</th>
                <th style={{ width: "18%" }}>Status</th>
                <th style={{ width: "14%", textAlign: "right" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map((app) => {
                const originalIndex = applications.indexOf(app);
                const isConfirming = deleteConfirmIndex === originalIndex;
                const isRejected = (app.status || "").toLowerCase().includes("not selected");
                const isSelected = (app.status || "").toLowerCase() === "selected";

                return (
                  <tr
                    key={app.id || originalIndex}
                    className={`table-row ${isRejected ? "table-row--rejected" : ""} ${
                      isSelected ? "table-row--selected" : ""
                    }`}
                  >
                    {/* Company */}
                    <td>
                      <div className="cell-company-role">
                        <div className="company-avatar">
                          {app.company ? app.company.charAt(0).toUpperCase() : "J"}
                        </div>
                        <div>
                          <span className="company-name">{app.company}</span>
                          <span className="date-subtext">Applied: {app.appliedDate || "Recently"}</span>
                        </div>
                      </div>
                    </td>

                    {/* Job Role */}
                    <td>
                      <div className="role-cell">
                        <span className="role-title">{app.role}</span>
                        {app.salary && (
                          <span className="salary-pill">{app.salary}</span>
                        )}
                        {app.notes && (
                          <p className="app-notes-snippet">{app.notes}</p>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td>
                      <span className="location-cell">
                        <IconMapPin size={14} className="cell-icon" />
                        <span>{app.location || "Tamil Nadu"}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td>
                      <StatusBadge status={app.status || "Applied"} />
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: "right" }}>
                      {isConfirming ? (
                        <div className="delete-confirm-box">
                          <span className="delete-confirm-text">Confirm?</span>
                          <button
                            type="button"
                            className="btn-danger-confirm"
                            onClick={() => confirmDelete(originalIndex)}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            className="btn-cancel-confirm"
                            onClick={() => setDeleteConfirmIndex(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="row-actions-group">
                          <button
                            type="button"
                            className="btn-action btn-action--edit"
                            onClick={() => onEdit && onEdit(originalIndex)}
                            title="Edit notes / details"
                          >
                            <IconEdit size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            className="btn-action btn-action--delete"
                            onClick={() => handleDeleteClick(originalIndex)}
                            title="Delete entry"
                          >
                            <IconTrash size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
