const AUTH_KEYS = [
  "access_token",
  "token",
  "authToken",
  "user",
  "role",
  "name",
  "email",
];

export function getStoredToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getStoredToken();
  return token
    ? { ...extraHeaders, Authorization: `Bearer ${token}` }
    : { ...extraHeaders };
}

export function clearStoredAuth() {
  AUTH_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });
}
