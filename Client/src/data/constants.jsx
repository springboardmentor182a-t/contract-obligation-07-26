export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
export const APP_NAME = 'Contract Obligation Tracking';

export const STORAGE_KEYS = {
  USER: 'cot_user',
  TOKEN: 'cot_token',
  THEME: 'cot_theme'
};


export const CONTRACT_STATUSES = {
  ACTIVE: 'Active',
  DRAFT: 'Draft',
  REVIEW: 'Under Review',
  ARCHIVED: 'Archived',
  EXPIRED: 'Expired'
};
