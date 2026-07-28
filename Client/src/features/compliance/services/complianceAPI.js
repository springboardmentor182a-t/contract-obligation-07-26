const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getComplianceItems = async () => {
  const response = await fetch(`${BASE_URL}/compliance/compliances`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch compliance items");
  }
  return await response.json();
};
