import axios from "axios";

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://contract-obligation-demo-group-c.onrender.com/api";

const API = axios.create({
  baseURL: API_BASE,
});

export async function signup(name, email, password) {
  if (!name || !email || !password) throw new Error("Fill in every field to create an account.");
  const response = await API.post("/auth/register", { name, email, password });
  return response.data;
}

export default signup;
