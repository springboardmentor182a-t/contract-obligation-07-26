const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getRenewals = async () => {
  const response = await fetch(`${BASE_URL}/renewals`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch renewals");
  }
  return await response.json();
};

export const getRenewalById = async (id) => {
  const response = await fetch(`${BASE_URL}/renewals/${id}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch renewal details");
  }
  return await response.json();
};
