import { API_BASE } from "../../../config/api";

export async function login(email, password, role = "Administrator") {
  if (!email || !password) throw new Error("Enter an email and password.");
  
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, role }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }
  
  // Store auth data
  localStorage.setItem("token", data.access_token);
  localStorage.setItem("role", data.role);
  localStorage.setItem("name", data.name || email.split("@")[0]);
  
  return { 
    name: data.name || email.split("@")[0], 
    email, 
    role: data.role,
    token: data.access_token 
  };
}

export default login;
