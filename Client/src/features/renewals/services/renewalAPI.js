const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Fetch the dashboard summary (counts per status, expiring soon, value at risk).
 */
export const getRenewalSummary = async () => {
  const response = await fetch(`${BASE_URL}/renewals/summary`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch renewal summary");
  }
  return await response.json();
};

/**
 * Fetch all renewals with optional filters.
 */
export const getRenewals = async (search = null, category = null, status = null) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (category && category !== "All") params.append("category", category);
  if (status && status !== "All") params.append("status", status);

  const response = await fetch(`${BASE_URL}/renewals/?${params.toString()}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch renewals");
  }
  return await response.json();
};

/**
 * Fetch a single renewal by ID (includes approvals, reminders, history).
 */
export const getRenewalById = async (id) => {
  const response = await fetch(`${BASE_URL}/renewals/${id}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch renewal details");
  }
  return await response.json();
};

/**
 * Create a new renewal record.
 */
export const createRenewal = async (renewalData) => {
  const response = await fetch(`${BASE_URL}/renewals/`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(renewalData)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to create renewal");
  }
  return data;
};

/**
 * Update a renewal's status.
 */
export const updateRenewalStatus = async (renewalId, status, performedBy = "Current User") => {
  const response = await fetch(`${BASE_URL}/renewals/${renewalId}/status`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ status, performed_by: performedBy })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to update renewal status");
  }
  return data;
};

/**
 * Submit an approval or rejection action on a renewal.
 */
export const submitApproval = async (renewalId, stepName, action, approver = "Current User", comments = null) => {
  const response = await fetch(`${BASE_URL}/renewals/${renewalId}/approve`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      step_name: stepName,
      action,
      approver,
      comments
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to submit approval action");
  }
  return data;
};

/**
 * Schedule a reminder for a renewal.
 */
export const scheduleReminder = async (renewalId, reminderDate, message = null) => {
  const response = await fetch(`${BASE_URL}/renewals/${renewalId}/reminder`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      reminder_date: reminderDate,
      message
    })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to schedule reminder");
  }
  return data;
};

/**
 * Send pending reminders for a renewal.
 */
export const sendReminder = async (renewalId) => {
  const response = await fetch(`${BASE_URL}/renewals/${renewalId}/send-reminder`, {
    method: "POST",
    headers: getHeaders()
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to send reminder");
  }
  return data;
};

/**
 * Generate renewal records from existing contracts and obligations.
 */
export const generateRenewals = async () => {
  const response = await fetch(`${BASE_URL}/renewals/generate`, {
    method: "POST",
    headers: getHeaders()
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to generate renewals");
  }
  return data;
};

/**
 * Fetch AI recommendation for a specific renewal.
 */
export const getRenewalAIRecommendation = async (renewalId) => {
  const response = await fetch(`${BASE_URL}/renewals/${renewalId}/ai-recommendation`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch AI recommendation");
  }
  return await response.json();
};
