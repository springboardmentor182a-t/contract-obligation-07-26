import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Get all renewals
export const getRenewals = async () => {
  const response = await API.get("/renewals/");
  return response.data;
};

// Create renewal
export const createRenewal = async (data) => {
  const response = await API.post("/renewals/", data);
  return response.data;
};

// Update renewal
export const updateRenewal = async (id, data) => {
  const response = await API.put(`/renewals/${id}`, data);
  return response.data;
};

// Delete renewal
export const deleteRenewal = async (id) => {
  const response = await API.delete(`/renewals/${id}`);
  return response.data;
};