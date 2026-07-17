const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getAuditLogs = async () => {
  const response = await fetch(`${BASE_URL}/audit_logs/audit_logs`, {
    method: "GET",
    headers: getHeaders()
  });
  
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(data.detail || data.message || "Failed to fetch audit logs");
  }
  return data;
};
