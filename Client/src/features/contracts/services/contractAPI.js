const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

export const getContracts = async () => {
  const response = await fetch(`${BASE_URL}/contracts/`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch contracts");
  }
  return await response.json();
};

export const getContractById = async (id) => {
  const response = await fetch(`${BASE_URL}/contracts/${id}`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch contract details");
  }
  return await response.json();
};

export const getArchivedContracts = async () => {
  const response = await fetch(`${BASE_URL}/contracts/archived`, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    if (response.status === 404) return [];
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || data.message || "Failed to fetch archived contracts");
  }
  return await response.json();
};
