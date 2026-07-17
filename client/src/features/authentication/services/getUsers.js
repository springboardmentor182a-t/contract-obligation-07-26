const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const getUsers = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Failed to fetch user profile");
    }

    return data;

  } catch (error) {
    console.error("User Profile Fetch Error:", error.message);
    throw error;
  }
};
