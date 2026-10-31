// Job Hunt Frontend API Client Service
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "jobhunt_auth_token_v2";

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (e) {
    console.error("Storage error:", e);
  }
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getStoredToken();

  const headers = {
    ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    method: options.method || "GET",
    headers,
    ...(options.body ? { body: options.isFormData ? options.body : JSON.stringify(options.body) } : {}),
  };

  try {
    const res = await fetch(url, config);

    if (res.status === 204) {
      return null;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = data?.detail || `HTTP ${res.status}: ${res.statusText}`;
      const err = new Error(errorMsg);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    // Distinguish network connection failures (e.g. backend offline)
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      console.warn(`[Job Hunt API] Backend at ${url} unreachable. Using offline state.`);
    }
    throw err;
  }
}

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const res = await request("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (res?.access_token) {
      setStoredToken(res.access_token);
    }
    return res;
  },

  register: async (userData) => {
    const res = await request("/auth/register", {
      method: "POST",
      body: userData,
    });
    if (res?.access_token) {
      setStoredToken(res.access_token);
    }
    return res;
  },

  me: () => request("/auth/me"),

  logout: () => {
    setStoredToken(null);
  },
};

// Jobs API
export const jobsAPI = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.district && params.district !== "ALL") query.append("district", params.district);
    if (params.category && params.category !== "ALL") query.append("category", params.category);
    if (params.work_mode && params.work_mode !== "ALL") query.append("work_mode", params.work_mode);
    if (params.experience && params.experience !== "ALL") query.append("experience", params.experience);
    if (params.search) query.append("search", params.search);
    const qs = query.toString();
    return request(`/jobs${qs ? `?${qs}` : ""}`);
  },

  get: (id) => request(`/jobs/${id}`),

  create: (jobData) =>
    request("/jobs", {
      method: "POST",
      body: jobData,
    }),

  update: (id, jobData) =>
    request(`/jobs/${id}`, {
      method: "PUT",
      body: jobData,
    }),

  delete: (id) =>
    request(`/jobs/${id}`, {
      method: "DELETE",
    }),
};

// Applications API
export const applicationsAPI = {
  list: () => request("/applications"),

  apply: (jobId, notes = "") =>
    request("/applications", {
      method: "POST",
      body: { job_id: jobId, notes },
    }),

  updateStatus: (appId, status, notes = "") =>
    request(`/applications/${appId}/status`, {
      method: "PATCH",
      body: { status, notes },
    }),

  downloadResumeUrl: (appId) => `${API_BASE_URL}/applications/${appId}/resume`,
};

// Candidate Profile & Uploads
export const candidatesAPI = {
  getProfile: () => request("/candidates/me/profile"),

  updateProfile: (profileData) =>
    request("/candidates/me/profile", {
      method: "PUT",
      body: profileData,
    }),

  uploadResume: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/candidates/me/resume", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  uploadPhoto: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return request("/candidates/me/photo", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },
};

// Interviews API
export const interviewsAPI = {
  list: () => request("/interviews"),

  schedule: (interviewData) =>
    request("/interviews", {
      method: "POST",
      body: interviewData,
    }),
};

// AI Career Assistant API
export const aiAPI = {
  query: (prompt, candidateProfile = null) =>
    request("/ai/query", {
      method: "POST",
      body: { prompt, candidate_profile: candidateProfile },
    }),
};

// Admin Console API (Manojkumar)
export const adminAPI = {
  getStats: () => request("/admin/stats"),

  getUsers: (role = null) => request(`/admin/users${role ? `?role=${role}` : ""}`),

  createRecruiter: (recruiterData) =>
    request("/admin/recruiters", {
      method: "POST",
      body: recruiterData,
    }),

  toggleUserStatus: (userId) =>
    request(`/admin/users/${userId}/toggle-status`, {
      method: "PATCH",
    }),

  getEmailLogs: () => request("/admin/email-logs"),

  getAuditLogs: () => request("/admin/audit-logs"),
};

// Courses API
export const coursesAPI = {
  list: (category = null) => request(`/courses${category ? `?category=${category}` : ""}`),
  get: (courseId) => request(`/courses/${courseId}`),
  enroll: (courseId, paymentData = {}) =>
    request(`/courses/${courseId}/enroll`, {
      method: "POST",
      body: paymentData,
    }),
};

// Payments & UPI API
export const paymentsAPI = {
  createOrder: (courseId, amount, paymentMethod = "UPI") =>
    request("/payments/orders", {
      method: "POST",
      body: { course_id: courseId, amount, payment_method: paymentMethod },
    }),

  verify: (orderId, upiRef = null) =>
    request("/payments/verify", {
      method: "POST",
      body: { order_id: orderId, upi_ref: upiRef },
    }),

  getReceipt: (orderId) => request(`/payments/receipt/${orderId}`),
};

// Community Feed API
export const communityAPI = {
  getPosts: () => request("/community/posts"),
  createPost: (postData) =>
    request("/community/posts", {
      method: "POST",
      body: postData,
    }),
  likePost: (postId) =>
    request(`/community/posts/${postId}/like`, {
      method: "POST",
    }),
  addComment: (postId, content) =>
    request(`/community/posts/${postId}/comments`, {
      method: "POST",
      body: { content },
    }),
};

// Direct Messaging API
export const messagesAPI = {
  getConversations: () => request("/messages/conversations"),
  getThread: (userId) => request(`/messages/${userId}`),
  send: (receiverId, content, attachmentUrl = null) =>
    request("/messages", {
      method: "POST",
      body: { receiver_id: receiverId, content, attachment_url: attachmentUrl },
    }),
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  candidates: candidatesAPI,
  interviews: interviewsAPI,
  ai: aiAPI,
  admin: adminAPI,
  courses: coursesAPI,
  payments: paymentsAPI,
  community: communityAPI,
  messages: messagesAPI,
};
