import axios from "axios";
import { getStoredToken } from "../utils/auth";

import { API_BASE } from "../config/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===============================
// AI Compliance Guardian Dashboard
// ===============================
export const getComplianceDashboard = async () => {
  const response = await api.get("/compliance/dashboard");
  return response.data;
};

export default api;
