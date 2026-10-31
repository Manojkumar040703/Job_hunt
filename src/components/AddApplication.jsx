import { useEffect, useState } from "react";
import { IconBuilding, IconBriefcase, IconMapPin, IconPlus, IconClose, IconCalendar } from "./Icons";

function AddApplication({
  onAdd,
  onUpdate,
  onCancel,
  editIndex,
  applications,
  isModal = false,
}) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    jobType: "Full-time",
    salary: "",
    status: "Applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editIndex !== null && applications[editIndex]) {
      const app = applications[editIndex];
      setFormData({
        company: app.company || "",
        role: app.role || "",
        location: app.location || "",
        jobType: app.jobType || "Full-time",
        salary: app.salary || "",
        status: app.status || "Applied",
        appliedDate: app.appliedDate || new Date().toISOString().split("T")[0],
        notes: app.notes || "",
      });
      setErrors({});
    } else {
      resetForm();
    }
  }, [editIndex, applications]);

  function resetForm() {
    setFormData({
      company: "",
      role: "",
      location: "",
      jobType: "Full-time",
      salary: "",
      status: "Applied",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setErrors({});
  }

  function validate() {
    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = "Company name is required";
    if (!formData.role.trim()) newErrors.role = "Job role is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) return;

    const payload = {
      ...formData,
      id: editIndex !== null && applications[editIndex]?.id ? applications[editIndex].id : Date.now().toString(),
      updatedAt: new Date().toISOString(),
    };

    if (editIndex !== null) {
      onUpdate(payload);
    } else {
      onAdd(payload);
    }

    resetForm();
    if (onCancel) onCancel();
  }

  return (
    <div className={`add-app-card ${isModal ? "add-app-card--modal" : ""}`}>
      <div className="add-app-card__header">
        <div>
          <h3>{editIndex !== null ? "Edit Application" : "Track New Job Application"}</h3>
          <p className="add-app-card__desc">
            {editIndex !== null
              ? "Update interview progress, company details, or application status"
              : "Keep full records of jobs you've applied to and manage your recruitment pipeline"}
          </p>
        </div>
        {onCancel && (
          <button type="button" className="btn-icon" onClick={onCancel} title="Close form">
            <IconClose size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="add-app-form">
        <div className="form-grid">
          {/* Company Name */}
          <div className="form-group">
            <label htmlFor="company">Company Name *</label>
            <div className="input-with-icon">
              <span className="input-icon"><IconBuilding size={16} /></span>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="e.g. Google, Microsoft, Razorpay"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? "input-error" : ""}
              />
            </div>
            {errors.company && <span className="error-text">{errors.company}</span>}
          </div>

          {/* Job Role */}
          <div className="form-group">
            <label htmlFor="role">Job Role *</label>
            <div className="input-with-icon">
              <span className="input-icon"><IconBriefcase size={16} /></span>
              <input
                id="role"
                name="role"
                type="text"
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role}
                onChange={handleChange}
                className={errors.role ? "input-error" : ""}
              />
            </div>
            {errors.role && <span className="error-text">{errors.role}</span>}
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <div className="input-with-icon">
              <span className="input-icon"><IconMapPin size={16} /></span>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="e.g. Chennai (OMR) / Coimbatore / Remote TN"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? "input-error" : ""}
              />
            </div>
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          {/* Job Type */}
          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          {/* Compensation / Salary */}
          <div className="form-group">
            <label htmlFor="salary">Estimated Salary / CTC</label>
            <input
              id="salary"
              name="salary"
              type="text"
              placeholder="e.g. ₹18 LPA or $110,000"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          {/* Application Status */}
          <div className="form-group">
            <label htmlFor="status">Application Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`select-status select-status--${formData.status.toLowerCase()}`}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Applied Date */}
          <div className="form-group">
            <label htmlFor="appliedDate">Applied Date</label>
            <div className="input-with-icon">
              <span className="input-icon"><IconCalendar size={16} /></span>
              <input
                id="appliedDate"
                name="appliedDate"
                type="date"
                value={formData.appliedDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="form-group form-group--full">
            <label htmlFor="notes">Notes / Referral / Portal Link</label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              placeholder="Referred by Sarah on LinkedIn; 2nd round scheduled for next Tuesday..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {editIndex !== null ? (
              "Save Changes"
            ) : (
              <>
                <IconPlus size={16} /> Track Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddApplication;
