// Mock login — accepts any non-empty email/password and simulates latency.
// TODO: replace with a real call once the server exposes POST /auth/login, e.g.
//   const res = await fetch(`${configValues.apiBaseUrl}/auth/login`, {
//     method: "POST", headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ email, password }),
//   });
import { API_BASE } from "../config/api";
export async function login(email, password) {
  await new Promise((r) => setTimeout(r, 400));
  if (!email || !password) throw new Error("Enter an email and password.");
  const name = email.split("@")[0];
  return { name: name.charAt(0).toUpperCase() + name.slice(1), email, role: "Administrator" };
}

export default login;
