import { API_BASE } from "../../../config/api";

export async function login(email, password) {
  if (!email || !password) {
    throw new Error("Enter an email and password.");
  }

  // OAuth2PasswordRequestForm expects
  // application/x-www-form-urlencoded data
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);
  formData.append("grant_type", "password");

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error(`Login failed (${res.status})`);
  }

  if (!res.ok) {
    let message = "Login failed.";

    if (typeof data?.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data?.detail)) {
      message = data.detail
        .map((item) => item.msg || item.message || "Invalid input")
        .join(", ");
    } else if (data?.detail) {
      message = JSON.stringify(data.detail);
    } else if (data?.message) {
      message = data.message;
    }

    throw new Error(message);
  }

  if (!data.access_token) {
    throw new Error(
      "Login succeeded but no access token was returned."
    );
  }

  localStorage.setItem("token", data.access_token);
  localStorage.setItem("role", data.role || "");
  localStorage.setItem(
    "name",
    data.name || email.split("@")[0]
  );

  return {
    name: data.name || email.split("@")[0],
    email,
    role: data.role || "",
    token: data.access_token,
  };
}

export default login;