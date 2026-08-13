import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useUI();

  useEffect(() => {
    logout();
    navigate("/login", { replace: true });
  }, [logout, navigate]);

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
