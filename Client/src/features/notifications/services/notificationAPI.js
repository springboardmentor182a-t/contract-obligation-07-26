const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getUserNotifications = async () => {
  const response = await fetch(`${BASE_URL}/notification/admin_notifications`, {
    method: "GET",
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) return []; // No notifications found
    throw new Error(data.detail || data.message || "Failed to fetch notifications");
  }
  return data;
};

export const getAdminNotifications = async () => {
  const response = await fetch(`${BASE_URL}/notification/admin_notifications`, {
    method: "GET",
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) return [];
    throw new Error(data.detail || data.message || "Failed to fetch admin notifications");
  }
  return data;
};

export const deleteNotification = async (notification_id) => {
  // Using exact spelling from backend route: delete_notificaion
  const response = await fetch(`${BASE_URL}/notification/delete_notificaion/${notification_id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || data.message || "Failed to delete notification");
  }
  return data;
};
