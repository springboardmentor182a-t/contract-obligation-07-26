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
// Dashboard
// ===============================
export const getDashboard = async () => {
  const response = await api.get("/renewals/dashboard");
  return response.data;
};

// ===============================
// Get All Renewals
// ===============================
export const getRenewals = async () => {
  const response = await api.get("/renewals/");
  return response.data;
};

// ===============================
// Get Raw Renewals
// ===============================
export const getRawRenewals = async () => {
  const response = await api.get("/renewals/raw");
  return response.data;
};

// ===============================
// Create Renewal
// ===============================
export const createRenewal = async (renewal) => {
  const response = await api.post("/renewals/", renewal);
  return response.data;
};

export default api;
