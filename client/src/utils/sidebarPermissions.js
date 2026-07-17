export const sidebarPermissions = {
  Administrator: [
    "Notifications",
    "Audit Logs",
    "User Management",
    "Settings",
  ],

  "Legal Manager": [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Compliance",
    "Reports & Analytics",
    "Notifications",
    "User Management",
    "Settings",
  ],

  "Compliance Officer": [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Compliance",
    "Notifications",
    "Settings",
  ],

  "Contract Manager": [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Notifications",
    "Settings",
  ],
};

export function getCurrentUserRole() {
  return (
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
    ""
  );
}

export function canAccessSidebarItem(role, itemLabel) {
  const allowedItems = sidebarPermissions[role] || [];
  return allowedItems.includes(itemLabel);
}