import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";
import RadioButton from "../components/Form/RadioButton";

const ROLES = ["Administrator", "Obligation Owner", "Compliance Reviewer", "Legal Signatory"];

export default function SwitchRole() {
  const { user, setUser } = useUI();
  const [role, setRole] = useState(user?.role || "Administrator");
  const navigate = useNavigate();

  function apply() {
    setUser((u) => ({ ...u, role }));
    navigate("/");
  }

  return (
    <div style={{ background: "var(--color-surface)", padding: 20, borderRadius: 12 }}>
      <h2 style={{ margin: 0 }}>Switch Role</h2>
      <p style={{ marginTop: 8, color: "var(--text-secondary)" }}>Select a different role.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, maxWidth: 320 }}>
        {ROLES.map((r) => (
          <RadioButton key={r} name="role" value={r} checked={role === r} onChange={() => setRole(r)} label={r} />
        ))}
      </div>
      <button className="quick-action" style={{ marginTop: 18 }} onClick={apply}>Apply Role</button>
    </div>
  );
}
