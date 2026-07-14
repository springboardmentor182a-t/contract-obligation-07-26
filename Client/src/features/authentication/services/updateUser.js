const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const updateUser = async (userData) => {
    const payload = {
        user_id: userData.user_id,
        role: userData.role,
        full_name: userData.name || userData.full_name,
        email: userData.email,
        phone: userData.phone || "0000000000",
        employee_id: userData.employee_id || "EMP000",
        company_name: userData.company_name || "",
        department: userData.department || "",
        designation: userData.designation || "",
        location: userData.location || "",
        join_date: userData.join_date || new Date().toISOString(),
        is_active: userData.is_active !== false
    };
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`${BASE_URL}/user/update_user`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            let errorMsg = "Failed to update user";
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
        console.error("Update User Error:", error.message);
        throw error;
    }
};
