import axios from "axios";
import { getStoredToken } from "../utils/auth";

// Supports both Vite and Create React App
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://contract-obligation-demo-group-c.onrender.com/api";

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
