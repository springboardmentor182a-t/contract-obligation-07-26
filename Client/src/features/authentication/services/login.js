const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";


export const loginService = async (credentials) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Login failed");
    }

    // Save JWT Token
    localStorage.setItem("access_token", data.access_token);
    
    // Attempt to save user ID if provided by the backend
    if (data.user_id) {
      localStorage.setItem("user_id", data.user_id);
    } else if (data.user && data.user.id) {
      localStorage.setItem("user_id", data.user.id);
    } else if (data.user_id === undefined) {
      // Sometimes it might just be 'id'
      if (data.id) localStorage.setItem("user_id", data.id);
    }

    console.log("Login Successful");
    return data;

  } catch (error) {
    console.error("Login Service Error:", error.message);
    throw error;
  }
};
