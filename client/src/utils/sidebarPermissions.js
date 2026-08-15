export const sidebarRoutes = {
  Dashboard: "/dashboard",
  "Contract Repository": "/repository",
  "Obligation Tracker": "/obligations",
  "Renewal Dashboard": "/renewal-dashboard",
  Compliance: "/compliance",
  "Reports & Analytics": "/reports",
  Notifications: "/notifications",
  "Quick Actions": "/quick-actions",
  Calendar: "/calendar",
  "Audit Logs": "/audit",
  "User Management": "/user-management",
  Settings: "/settings",
};

export const allSidebarModules = Object.keys(sidebarRoutes);
export const ALL_ITEMS = allSidebarModules;

export const sidebarPermissions = {
  Administrator: allSidebarModules,
  "Legal Manager": allSidebarModules,
  "Compliance Officer": allSidebarModules,
  "Contract Manager": allSidebarModules,
  "Department Head": allSidebarModules,
  Employee: allSidebarModules,
};

const alwaysAllowedRoutes = new Set(["/profile", "/help"]);

const routeAliases = {
  "/contract-repository": "/repository",
};

export function getCurrentUserRole(contextRole = "") {
  return (
    contextRole ||
    localStorage.getItem("role") ||
    sessionStorage.getItem("role") ||
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

export function hasQuickActions(role) {
  return true;
}
