import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://contract-obligation-demo-group-c.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE,
});

export async function login(email, password) {
  if (!email || !password) throw new Error("Enter an email and password.");
  const response = await API.post("/auth/login", { email, password });
  return response.data;
}

export default login;
