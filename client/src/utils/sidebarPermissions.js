export const sidebarPermissions = {
  Administrator: [
    "Notifications",
    "Calendar",
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
    "Quick Actions",
    "Calendar",
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
    "Quick Actions",
    "Calendar",
    "Settings",
  ],

  "Contract Manager": [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Notifications",
    "Quick Actions",
    "Calendar",
    "Settings",
  ],

  Employee: [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Notifications",
    "Settings",
  ],
};

// Routes that are controlled by sidebar permissions
const sidebarRoutes = {
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

// Routes that are always accessible to any authenticated user (not sidebar-gated)
const alwaysAllowedRoutes = new Set(["/profile", "/help"]);

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
  // Profile and Help are always accessible to any logged-in user
  if (alwaysAllowedRoutes.has(pathname)) return true;

  const normalizedPath = routeAliases[pathname] || pathname;
  const itemLabel = Object.keys(sidebarRoutes).find(
    (label) => sidebarRoutes[label] === normalizedPath
  );

  return Boolean(itemLabel && canAccessSidebarItem(role, itemLabel));
}

// Returns true if this role should see the Quick Actions button in the navbar
export function hasQuickActions(role) {
  return (sidebarPermissions[role] || []).includes("Quick Actions");
}
