import { useEffect, useState } from "react";
import "./Users.css";
import { getUsers } from "../features/authentication/services/getUsers";

function initials(name) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getUsers().then((list) => { if (active) { setUsers(list); setLoading(false); } });
    return () => { active = false; };
  }, []);

  return (
    <div className="page-surface users-page">
      <div className="page-head">
        <div>
          <h2>User Management</h2>
          <p className="muted">Manage users, roles and permissions.</p>
        </div>
        <button className="quick-action">+ Invite User</button>
      </div>

      {loading && <p className="muted">Loading team members...</p>}
      {!loading && users.map((u) => (
        <div className="user-row" key={u.id}>
          <div className="avatar user-avatar">{initials(u.name)}</div>
          <div style={{ flex: 1 }}>
            <div className="task-title">{u.name}</div>
            <div className="task-meta">{u.email}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className={"badge-pill " + (u.status === "Active" ? "badge-active" : "badge-invited")}>{u.role}</span>
            <div className="task-meta" style={{ marginTop: 4 }}>{u.status} \u00b7 {u.lastActive}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
