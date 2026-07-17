const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const changePassword = async (oldPassword, newPassword) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${BASE_URL}/auth/change_password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                old_password: oldPassword,
                new_password: newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.message || "Failed to change password");
        }

        return data;

    } catch (error) {
        console.error("Change Password Error:", error.message);
        throw error;
    }
};
