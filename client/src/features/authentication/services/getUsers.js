// getUsers dynamically queries the backend /api/users endpoint
import { API_BASE } from "../config/api";
export async function getUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to fetch users from server, returning empty directory", err);
  }
  return [];
}

export default getUsers;
