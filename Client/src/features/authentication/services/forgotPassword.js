const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const sendForgotPasswordOTP = async (email) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/forget_password?email=${encodeURIComponent(email)}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.message || "Failed to send OTP");
        }

        return data;

    } catch (error) {
        console.error("Forgot Password OTP Error:", error.message);
        throw error;
    }
};

export const verifyOTP = async (email, otp) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/verify_otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                otp: parseInt(otp, 10)
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.message || "Failed to verify OTP");
        }

        return data;

    } catch (error) {
        console.error("Verify OTP Error:", error.message);
        throw error;
    }
};

export const resetPassword = async (email, newPassword) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/new_password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                new_password: newPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || data.message || "Failed to reset password");
        }

        return data;

    } catch (error) {
        console.error("Reset Password Error:", error.message);
        throw error;
    }
};
