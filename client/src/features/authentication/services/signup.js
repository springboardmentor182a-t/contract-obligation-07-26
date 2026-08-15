import { API_BASE } from "../../../config/api";
import { login } from "./login";

export async function signup(name, email, password) {
  if (!name || !email || !password) throw new Error("Fill in every field to create an account.");
  
  // Backend requires these fields for registration
  const role = "Employee"; 
  const organization_id = 2; // ID 2 is Personal organization
  const department = "General";
  const phone = "";

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role, organization_id, department, phone }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.detail || "Signup failed");
  }

  // After successful registration, log the user in to retrieve the token
  const user = await login(email, password, role);
  return user;
}

export default signup;
