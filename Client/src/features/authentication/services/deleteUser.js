const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const deleteUser = async (user_id) => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/user/delete_user/${user_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Failed to delete user");
    }

    return data;
  } catch (error) {
    console.error("Delete User Error:", error.message);
    throw error;
  }
};
