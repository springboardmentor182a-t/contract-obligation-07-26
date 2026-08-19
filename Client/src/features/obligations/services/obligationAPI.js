const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getObligations = async () => {
  const response = await fetch(`${BASE_URL}/obligations`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch obligations");
  }
  return await response.json();
};

export const createObligation = async (obligationData) => {
  const response = await fetch(`${BASE_URL}/obligations`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(obligationData)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to create obligation");
  }
  return await response.json();
};

export const updateObligation = async (id, obligationData) => {
  const response = await fetch(`${BASE_URL}/obligations/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(obligationData)
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to update obligation");
  }
  return await response.json();
};
