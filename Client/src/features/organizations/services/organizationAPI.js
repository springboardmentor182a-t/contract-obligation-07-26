const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("access_token");
  const headers = {
    "Content-Type": "application/json"
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const getOrganizations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/organization/organizations`, {
      method: "GET",
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Failed to fetch organizations");
    return data;
  } catch (error) {
    console.error("Fetch Organizations Error:", error.message);
    throw error;
  }
};

export const updateOrganization = async (orgData) => {
  try {
    const response = await fetch(`${BASE_URL}/organization/update_organization`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(orgData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Failed to update organization");
    return data;
  } catch (error) {
    console.error("Update Organization Error:", error.message);
    throw error;
  }
};

export const deactivateOrganization = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/organization/deactivate_organization/${id}`, {
      method: "PUT",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Failed to deactivate organization");
    return data;
  } catch (error) {
    console.error("Deactivate Organization Error:", error.message);
    throw error;
  }
};

export const deleteOrganization = async (id) => {
  try {
    // Note: User's provided code has the route as /delete_user/{organization_id}
    const response = await fetch(`${BASE_URL}/organization/delete_user/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Failed to delete organization");
    return data;
  } catch (error) {
    console.error("Delete Organization Error:", error.message);
    throw error;
  }
};

export const createOrganization = async (orgData) => {
  try {
    const response = await fetch(`${BASE_URL}/organization/create_organization`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(orgData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.message || "Failed to create organization");
    return data;
  } catch (error) {
    console.error("Create Organization Error:", error.message);
    throw error;
  }
};
