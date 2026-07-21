const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const getUserSettings = async () => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${BASE_URL}/user_setting/settings`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.message || "Failed to fetch user settings");
        }

        return data;

    } catch (error) {
        console.error("Get User Settings Error:", error.message);
        throw error;
    }
};

export const updateUserSettings = async (settingsData) => {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${BASE_URL}/user_setting/settings`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(settingsData)
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMsg = "Failed to update user settings";
            if (Array.isArray(data.detail)) {
                errorMsg = data.detail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ');
            } else if (data.detail) {
                errorMsg = data.detail;
            } else if (data.message) {
                errorMsg = data.message;
            }
            throw new Error(errorMsg);
        }

        return data;

    } catch (error) {
        console.error("Update User Settings Error:", error.message);
        throw error;
    }
};
