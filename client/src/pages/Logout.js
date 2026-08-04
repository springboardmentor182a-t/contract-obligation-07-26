import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Authentication information remove cheyyadam
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    sessionStorage.clear();

    // Login page ki redirect
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div
      style={{
        background: "var(--color-surface)",
        padding: 20,
        borderRadius: 12,
      }}
    >
      <h2 style={{ margin: 0 }}>Logging out...</h2>
    </div>
  );
}