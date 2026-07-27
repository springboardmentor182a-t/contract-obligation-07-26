export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const ROUTES = {
  HOME: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SETTINGS: '/settings',
};

export const CONTRACT_STATUS = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
  EXPIRING: 'Expiring Soon',
  EXPIRED: 'Expired',
  TERMINATED: 'Terminated'
};

export const OBLIGATION_TYPE_OPTIONS = [
  { value: "Payment", label: "Payment" },
  { value: "Renewal", label: "Renewal" },
  { value: "Compliance", label: "Compliance" },
  { value: "Reporting", label: "Reporting" },
  { value: "Other", label: "Other" },
];
