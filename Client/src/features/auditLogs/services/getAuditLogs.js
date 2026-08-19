const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
});

const params = (filters = {}) =>
  new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '' && value !== 'All')
  ).toString();

export const getAuditLogs = async (filters) => {
  const query = params(filters);
  const response = await fetch(`${BASE_URL}/audit_logs?${query}`, { headers: headers() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch audit logs');
  return data;
};

export const getAuditSummary = async () => {
  const response = await fetch(`${BASE_URL}/audit_logs/summary`, { headers: headers() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch audit summary');
  return data;
};

export const getAuditAnalytics = async () => {
  const response = await fetch(`${BASE_URL}/audit_logs/analytics`, { headers: headers() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch audit analytics');
  return data;
};

export const getEntityAuditHistory = async (entityType, entityId) => {
  const response = await fetch(`${BASE_URL}/audit_logs/entity/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`, {
    headers: headers(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch entity audit trail');
  return data;
};

export const createAuditLog = async (logData) => {
  const response = await fetch(`${BASE_URL}/audit_logs`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(logData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to record audit event');
  return data;
};

export const exportAuditReport = async (filters, format = 'csv') => {
  const query = params({ ...filters, report_format: format });
  const response = await fetch(`${BASE_URL}/audit_logs/export/report?${query}`, { headers: headers() });
  if (!response.ok) throw new Error('Failed to export audit report');
  return response.blob();
};
export const getActivities = async (limit = 10) => {
  const response = await fetch(`${BASE_URL}/audit_logs/activities?limit=${limit}`, { headers: headers() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch activities');
  return data;
};
