const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('access_token')}` });
const params = (filters = {}) => new URLSearchParams(Object.entries(filters).filter(([, value]) => value && value !== 'All')).toString();

export const getAuditLogs = async (filters) => {
  const response = await fetch(`${BASE_URL}/audit_logs?${params(filters)}`, { headers: headers() });
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

export const exportAuditReport = async (filters, format = 'csv') => {
  const response = await fetch(`${BASE_URL}/audit_logs/export/report?${params({ ...filters, report_format: format })}`, { headers: headers() });
  if (!response.ok) throw new Error('Failed to export audit report');
  return response.blob();
};
export const getActivities = async (limit = 10) => {
  const response = await fetch(`${BASE_URL}/audit_logs/activities?limit=${limit}`, { headers: headers() });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'Failed to fetch activities');
  return data;
};
