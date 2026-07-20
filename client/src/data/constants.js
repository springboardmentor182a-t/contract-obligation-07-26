// Shared constants used across pages. Keep this the single source of truth
// for status colors/labels so every page (Repository, Obligations, Renewals,
// Compliance, Audit...) stays visually consistent.

export const STATUS_COLORS = {
  active: "#10B981",
  pending: "#F59E0B",
  draft: "#3B82F6",
  expired: "#EF4444",
  overdue: "#EF4444",
  due: "#F59E0B",
  ontrack: "#10B981",
  renewal: "#3B82F6",
  strong: "#10B981",
  review: "#F59E0B",
  atrisk: "#EF4444",
};

export const STATUS_LABELS = {
  active: "Active",
  pending: "Pending Signature",
  draft: "Draft",
  expired: "Expired",
  overdue: "Overdue",
  due: "Due Soon",
  ontrack: "On Track",
  renewal: "Renewal Window",
  strong: "Strong",
  review: "Needs Review",
  atrisk: "At Risk",
};

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const CONSTANTS = {
  STATUS_COLORS,
  STATUS_LABELS,
  MONTH_NAMES,
};

export default CONSTANTS;
