import { useState } from "react";
import {
  IconGraduation,
  IconCheckCircle,
  IconBookOpen,
  IconClock,
  IconSparkles,
  IconSearch,
  IconClose,
  IconShield,
  IconAward,
} from "./Icons";
import { useAuth } from "../context/AuthContext";

export default function CoursesMarketplace({
  courses = [],
  enrolledCourseIds = [],
  onEnrollCourse,
  onToast,
}) {
  const { user, openLogin } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeViewTab, setActiveViewTab] = useState("ALL"); // "ALL" | "ENROLLED" | "FREE"
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [priceFilter, setPriceFilter] = useState("ALL"); // "ALL" | "FREE" | "PAID"
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [checkoutCourse, setCheckoutCourse] = useState(null);
  const [viewingCertificateCourse, setViewingCertificateCourse] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // Filter logic
  const filteredCourses = courses.filter((c) => {
    const term = searchTerm.toLowerCase();
    const isEnrolled = enrolledCourseIds.includes(c.id);

    if (activeViewTab === "ENROLLED" && !isEnrolled) return false;
    if (activeViewTab === "FREE" && !c.isFree) return false;

    const matchesSearch =
      !term ||
      c.title.toLowerCase().includes(term) ||
      c.provider.toLowerCase().includes(term) ||
      (c.certificateType && c.certificateType.toLowerCase().includes(term)) ||
      (c.skills && c.skills.some((s) => s.toLowerCase().includes(term)));

    const matchesCategory =
      categoryFilter === "ALL" || c.category === categoryFilter;

    const matchesPrice =
      priceFilter === "ALL" ||
      (priceFilter === "FREE" && c.isFree) ||
      (priceFilter === "PAID" && !c.isFree);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  function handleStartEnrollment(course) {
    if (!user) {
      openLogin();
      return;
    }

    if (course.isFree) {
      // Direct free enrollment
      onEnrollCourse(course.id, {
        paymentId: "FREE-GRANT-" + Date.now(),
        amount: 0,
        enrolledAt: new Date().toISOString(),
      });
      if (onToast) onToast(`🎉 Enrolled in "${course.title}" for free!`);
    } else {
      // Open Razorpay test payment modal
      setCheckoutCourse(course);
      setPaymentSuccessData(null);
    }
  }

  function handleSimulatePayment(e) {
    e.preventDefault();
    if (!checkoutCourse) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const paymentRef = "pay_TN_" + Math.random().toString(36).substring(2, 10).toUpperCase();
      const enrollmentData = {
        paymentId: paymentRef,
        amount: checkoutCourse.price,
        orderId: "order_tn_" + Date.now(),
        provider: "Razorpay Test Gateway",
        enrolledAt: new Date().toISOString(),
      };

      onEnrollCourse(checkoutCourse.id, enrollmentData);
      setIsProcessingPayment(false);
      setPaymentSuccessData(enrollmentData);
      if (onToast) onToast(`✅ Payment successful for ${checkoutCourse.title}!`);
    }, 1200);
  }

  return (
    <div className="courses-marketplace-view">
      {/* Hero Banner */}
      <div className="courses-hero-banner">
        <div className="hero-content">
          <span className="hero-badge">
            <IconAward size={14} /> TAMIL NADU SKILL DEVELOPMENT & CERTIFICATION
          </span>
          <h1>Industry & Academic Certifications</h1>
          <p>
            Upskill with verified courses from IIT Madras Pravartak, Anna University, NIFT, and Tamil Nadu Skill Development Corporation (TNSDC).
          </p>

          {/* Search Bar */}
          <div className="hero-search-bar">
            <div className="search-field">
              <IconSearch size={18} className="search-icon-hero" />
              <input
                type="text"
                placeholder="Search Python, Electric Vehicles, Garment Merchandising..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="search-divider" />

            <div className="filter-select-box-hero">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">All Disciplines (Statewide)</option>
                <option value="it">IT & Software Engineering</option>
                <option value="auto">Automotive & EV Mobility</option>
                <option value="textile">Textiles & Garment Merchandising</option>
                <option value="health">Healthcare IT & Medical Coding</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Navigation Tabs */}
      <div className="courses-sector-tabs-container">
        <div className="courses-sector-tabs">
          <button
            type="button"
            className={`sector-tab-btn ${activeViewTab === "ALL" ? "sector-tab-btn--active" : ""}`}
            onClick={() => setActiveViewTab("ALL")}
          >
            <IconBookOpen size={16} /> All Programs ({courses.length})
          </button>

          <button
            type="button"
            className={`sector-tab-btn ${activeViewTab === "ENROLLED" ? "sector-tab-btn--active" : ""}`}
            onClick={() => setActiveViewTab("ENROLLED")}
          >
            <IconAward size={16} /> My Enrolled & Certificates
            {enrolledCourseIds.length > 0 && (
              <span className="sector-badge-count">{enrolledCourseIds.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`sector-tab-btn ${activeViewTab === "FREE" ? "sector-tab-btn--active" : ""}`}
            onClick={() => setActiveViewTab("FREE")}
          >
            <IconCheckCircle size={16} /> 100% Free Government Grants
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="courses-filters-row">
        <div className="filter-chips-group">
          <span className="filter-label">Pricing:</span>
          {["ALL", "FREE", "PAID"].map((p) => (
            <button
              key={p}
              type="button"
              className={`filter-chip ${priceFilter === p ? "filter-chip--active" : ""}`}
              onClick={() => setPriceFilter(p)}
            >
              {p === "ALL" ? "All Pricing" : p === "FREE" ? "Free Courses" : "Paid Programs"}
            </button>
          ))}
        </div>

        <div className="results-count-text">
          Showing <strong>{filteredCourses.length}</strong> accredited programs
        </div>
      </div>

      {/* Course Grid */}
      <div className="courses-grid">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);

          return (
            <div key={course.id} className="course-card">
              <div className="course-card__header">
                <span className="course-provider-tag">
                  <IconShield size={13} /> {course.provider}
                </span>
                <span className={`course-cost-pill ${course.isFree ? "course-cost-pill--free" : ""}`}>
                  {course.isFree ? "Free Program" : `₹${course.price.toLocaleString("en-IN")}`}
                </span>
              </div>

              <h3 className="course-title" onClick={() => setSelectedCourse(course)}>
                {course.title}
              </h3>

              <p className="course-description">{course.description}</p>

              <div className="course-metadata-row">
                <span>
                  <IconClock size={13} /> {course.duration}
                </span>
                <span>🗣️ {course.language || "English & Tamil"}</span>
                <span>⭐ {course.rating} ({(course.enrolledCount || course.studentsCount || 0).toLocaleString("en-IN")} learners)</span>
              </div>

              {/* Skills Tags */}
              <div className="course-skills-row">
                {course.skills?.map((sk) => (
                  <span key={sk} className="skill-pill-sm">
                    {sk}
                  </span>
                ))}
              </div>

              <div
                className="course-cert-banner course-cert-banner--clickable"
                onClick={() => setViewingCertificateCourse(course)}
                title="Click to view accredited certificate"
                style={{ cursor: "pointer" }}
              >
                <IconAward size={14} />
                <span>{course.certificateType}</span>
                <span className="cert-preview-badge">View Certificate →</span>
              </div>

              <div className="course-card__footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedCourse(course)}
                >
                  View Syllabus
                </button>

                {isEnrolled ? (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm btn-view-cert"
                    onClick={() => setViewingCertificateCourse(course)}
                  >
                    <IconAward size={14} /> View Certificate
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStartEnrollment(course)}
                  >
                    {course.isFree ? "Enroll for Free" : `Enroll Now (₹${course.price})`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Syllabus & Course Detail Modal */}
      {selectedCourse && (
        <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="modal-content course-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="course-provider-tag">
                  <IconShield size={14} /> {selectedCourse.provider}
                </span>
                <h2>{selectedCourse.title}</h2>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setSelectedCourse(null)}
              >
                <IconClose size={20} />
              </button>
            </div>

            <div className="course-modal-meta-grid">
              <div>
                <span className="meta-label">Duration</span>
                <span className="meta-val">{selectedCourse.duration}</span>
              </div>
              <div>
                <span className="meta-label">Instruction Language</span>
                <span className="meta-val">{selectedCourse.language}</span>
              </div>
              <div>
                <span className="meta-label">Accreditation</span>
                <span className="meta-val">{selectedCourse.certificateType}</span>
              </div>
              <div>
                <span className="meta-label">Fee</span>
                <span className="meta-val">
                  {selectedCourse.isFree ? "100% Free (Government / Academy Grant)" : `₹${selectedCourse.price}`}
                </span>
              </div>
            </div>

            <div className="course-modal-body">
              <section>
                <h4>Course Curriculum & Syllabus</h4>
                <ul className="syllabus-list">
                  {selectedCourse.syllabus?.map((syl, i) => (
                    <li key={i}>
                      <IconBookOpen size={16} />
                      <span>{syl}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section style={{ marginTop: "16px" }}>
                <h4>Eligibility & Target Audience</h4>
                <p className="eligibility-text">{selectedCourse.eligibility}</p>
              </section>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedCourse(null)}
              >
                Close
              </button>
              {enrolledCourseIds.includes(selectedCourse.id) ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const c = selectedCourse;
                    setSelectedCourse(null);
                    setViewingCertificateCourse(c);
                  }}
                >
                  <IconAward size={16} /> View Accredited Certificate
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const c = selectedCourse;
                    setSelectedCourse(null);
                    handleStartEnrollment(c);
                  }}
                >
                  {selectedCourse.isFree ? "Enroll for Free" : `Proceed to Payment (₹${selectedCourse.price})`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Test Checkout Modal */}
      {checkoutCourse && (
        <div className="modal-backdrop" onClick={() => !isProcessingPayment && setCheckoutCourse(null)}>
          <div className="modal-content checkout-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header">
              <div className="checkout-brand">
                <span className="razorpay-badge">🔒 SECURE CHECKOUT (RAZORPAY TEST)</span>
                <h3>Enroll in {checkoutCourse.title}</h3>
                <p className="checkout-sub">Certificate issued upon course milestone completion.</p>
              </div>
              {!isProcessingPayment && !paymentSuccessData && (
                <button
                  type="button"
                  className="btn-icon"
                  onClick={() => setCheckoutCourse(null)}
                >
                  <IconClose size={18} />
                </button>
              )}
            </div>

            {!paymentSuccessData ? (
              <form onSubmit={handleSimulatePayment} className="checkout-form">
                <div className="checkout-summary-box">
                  <div className="summary-line">
                    <span>Course Fee</span>
                    <span>₹{checkoutCourse.price}</span>
                  </div>
                  <div className="summary-line">
                    <span>GST (18% inclusive)</span>
                    <span>₹{Math.round(checkoutCourse.price * 0.18)}</span>
                  </div>
                  <div className="summary-divider" />
                  <div className="summary-line summary-total">
                    <strong>Total Amount Payable</strong>
                    <strong className="total-price">₹{checkoutCourse.price}</strong>
                  </div>
                </div>

                <div className="gateway-notice">
                  <IconShield size={16} />
                  <span>
                    Sandbox Test Environment. No real bank charges will occur. Generates authentic cryptographic order & receipt.
                  </span>
                </div>

                <div className="checkout-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={isProcessingPayment}
                    onClick={() => setCheckoutCourse(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-pay-now"
                    disabled={isProcessingPayment}
                  >
                    {isProcessingPayment ? "Verifying Transaction..." : `Pay ₹${checkoutCourse.price} via Razorpay`}
                  </button>
                </div>
              </form>
            ) : (
              <div className="payment-success-card">
                <div className="success-icon-wrap">
                  <IconCheckCircle size={42} />
                </div>
                <h3>Enrollment Confirmed!</h3>
                <p>Welcome to <strong>{checkoutCourse.title}</strong>.</p>
                <div className="receipt-box">
                  <div><span>Payment ID:</span> <code>{paymentSuccessData.paymentId}</code></div>
                  <div><span>Order Ref:</span> <code>{paymentSuccessData.orderId}</code></div>
                  <div><span>Gateway:</span> {paymentSuccessData.provider}</div>
                  <div><span>Timestamp:</span> {new Date(paymentSuccessData.enrolledAt).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setCheckoutCourse(null)}
                >
                  Go to Learning Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Official Accredited Certificate Modal */}
      {viewingCertificateCourse && (
        <div
          className="modal-backdrop"
          onClick={() => setViewingCertificateCourse(null)}
        >
          <div
            className="modal-content certificate-modal-content glass-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="certificate-modal-header">
              <span className="cert-header-tag">
                <IconAward size={14} /> Official Tamil Nadu Accredited Credential
              </span>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setViewingCertificateCourse(null)}
                title="Close"
              >
                <IconClose size={20} />
              </button>
            </div>

            {/* Certificate Paper Canvas */}
            <div className="certificate-canvas">
              <div className="certificate-canvas__inner-border">
                <div className="cert-top-crest">
                  <div className="cert-state-crest">🏛️</div>
                  <div className="cert-authority-title">
                    <h4>GOVERNMENT OF TAMIL NADU</h4>
                    <p>Skill Development & Higher Education Accreditation Board</p>
                    <span className="cert-partner-label">In Collaboration with {viewingCertificateCourse.provider}</span>
                  </div>
                </div>

                <div className="cert-heading-group">
                  <h2>CERTIFICATE OF COMPLETION</h2>
                  <p className="cert-subheading">THIS IS TO ACCREDIT AND CERTIFY THAT</p>
                </div>

                <div className="cert-recipient-name">
                  <h3>{user?.name || "Karthik Subramanian"}</h3>
                  <div className="cert-name-underline" />
                </div>

                <p className="cert-body-statement">
                  has successfully fulfilled all curriculum requirements, continuous assessments, and state industrial standards for the accredited program
                </p>

                <h3 className="cert-course-title">
                  {viewingCertificateCourse.title}
                </h3>

                <div className="cert-details-grid">
                  <div className="cert-detail-item">
                    <span className="detail-label">Accreditation:</span>
                    <span className="detail-value">{viewingCertificateCourse.certificateType}</span>
                  </div>
                  <div className="cert-detail-item">
                    <span className="detail-label">Verification ID:</span>
                    <code className="detail-code">TN-CERT-2026-{viewingCertificateCourse.id.toUpperCase()}-882</code>
                  </div>
                  <div className="cert-detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value text-emerald">Verified & Active ✓</span>
                  </div>
                </div>

                <div className="cert-footer-signatures">
                  <div className="cert-signature-block">
                    <div className="sig-handwriting">Dr. M. S. Swaminathan</div>
                    <div className="sig-line" />
                    <span className="sig-title">Academic Director, {viewingCertificateCourse.provider}</span>
                  </div>

                  <div className="cert-gold-seal">
                    <div className="seal-outer">
                      <div className="seal-inner">
                        <span>★ VERIFIED ★</span>
                        <strong>TNSDC</strong>
                        <span>2026</span>
                      </div>
                    </div>
                  </div>

                  <div className="cert-signature-block">
                    <div className="sig-handwriting">P. Thangamani, IAS</div>
                    <div className="sig-line" />
                    <span className="sig-title">Principal Secretary, Tamil Nadu Skill Mission</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="certificate-modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  if (onToast) onToast("📋 Verification link copied: https://jobhunt.tn.gov.in/verify/" + viewingCertificateCourse.id);
                }}
              >
                📋 Copy Link
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  window.print();
                  if (onToast) onToast("📥 Certificate ready for PDF saving/printing!");
                }}
              >
                📥 Download / Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
