const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const toggleUserStatus = async (user_id) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/user/deactivate_user/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Failed to toggle user status");
    }

    return data;
  } catch (error) {
    console.error("Toggle User Status Error:", error.message);
    throw error;
  }
};
