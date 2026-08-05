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

  Employee: [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Compliance",
    "Reports & Analytics",
    "Notifications",
    "Audit Logs",
    "User Management",
    "Settings",
  ],
};

const sidebarRoutes = {
  Dashboard: "/dashboard",
  "Contract Repository": "/repository",
  "Obligation Tracker": "/obligations",
  "Renewal Dashboard": "/renewal-dashboard",
  Compliance: "/compliance",
  "Reports & Analytics": "/reports",
  Notifications: "/notifications",
  "Audit Logs": "/audit",
  "User Management": "/user-management",
  Settings: "/settings",
};

const routeAliases = {
  "/contract-repository": "/repository",
};

export function getCurrentUserRole(contextRole = "") {
  return (
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
    contextRole ||
    ""
  );
}

export function canAccessSidebarItem(role, itemLabel) {
  const allowedItems = sidebarPermissions[role] || [];
  return allowedItems.includes(itemLabel);
}

export function isKnownRole(role) {
  return Object.prototype.hasOwnProperty.call(sidebarPermissions, role);
}

export function getDefaultRouteForRole(role) {
  const firstAllowedItem = sidebarPermissions[role]?.[0];
  return firstAllowedItem ? sidebarRoutes[firstAllowedItem] || null : null;
}

export function canAccessRoute(role, pathname) {
  const normalizedPath = routeAliases[pathname] || pathname;
  const itemLabel = Object.keys(sidebarRoutes).find(
    (label) => sidebarRoutes[label] === normalizedPath
  );

  return Boolean(itemLabel && canAccessSidebarItem(role, itemLabel));
}
