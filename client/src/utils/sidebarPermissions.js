const ALL_ITEMS = [
  "Dashboard",
  "Contract Repository",
  "Obligation Tracker",
  "Renewal Dashboard",
  "Compliance",
  "Reports & Analytics",
  "Notifications",
  "Calendar",
  "Audit Logs",
  "User Management",
  "Settings",
];

export const sidebarPermissions = {
  Administrator: ALL_ITEMS,
  "Legal Manager": ALL_ITEMS,
  "Compliance Officer": ALL_ITEMS,
  "Contract Manager": ALL_ITEMS,
  Employee: ALL_ITEMS,
};

const sidebarRoutes = {
  Dashboard: "/dashboard",
  "Contract Repository": "/repository",
  "Obligation Tracker": "/obligations",
  "Renewal Dashboard": "/renewal-dashboard",
  Compliance: "/compliance",
  "Reports & Analytics": "/reports",
  Notifications: "/notifications",
  Calendar: "/calendar",
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
    "Administrator"
  );
}

export function canAccessSidebarItem(role, itemLabel) {
  const allowedItems = sidebarPermissions[role] || ALL_ITEMS;
  return allowedItems.includes(itemLabel);
}

export function isKnownRole(role) {
  return true;
}

export function getDefaultRouteForRole(role) {
  const firstAllowedItem = (sidebarPermissions[role] || ALL_ITEMS)[0];
  return firstAllowedItem ? sidebarRoutes[firstAllowedItem] || "/dashboard" : "/dashboard";
}

export function canAccessRoute(role, pathname) {
  return true;
}
