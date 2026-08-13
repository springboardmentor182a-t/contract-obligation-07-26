import { useEffect, useState } from "react";
import { useUI } from "../context/UIContext";
import { FileIcon, AlertTriIcon, InfoIcon, RepeatIcon } from "../components/Icons";

function Kpi({ Icon, color, val, label, loading }) {
  return (
    <div className="kpi-card">
      <div className="top">
        <div className="ico" style={{ background: color + "22", color }}>
          <Icon size={17} />
        </div>
      </div>
      <div className="val">{loading ? "—" : val}</div>
      <div className="lbl">{label}</div>
    </div>
  );
}

function statusBadge(status = "") {
  const s = String(status).toLowerCase();
  if (s === "overdue") return <span className="badge danger">Overdue</span>;
  if (s === "completed" || s === "done") return <span className="badge emerald">Completed</span>;
  if (s === "due" || s === "pending" || s === "due soon") return <span className="badge warn">Due Soon</span>;
  return <span className="badge info">On Track</span>;
}

export default function Dashboard() {
  const { user } = useUI();
  const firstName = (user?.name || "User").split(" ")[0];

  const [kpis, setKpis] = useState({ contracts: 0, obligations: 0, overdue: 0, renewals: 0 });
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    async function load() {
      try {
        const [cRes, oRes, rRes] = await Promise.allSettled([
          fetch("/api/contracts", { headers }),
          fetch("/api/obligations/", { headers }),
          fetch("/api/renewals/", { headers }),
        ]);

        let contracts = [], obls = [], renewals = [];
        if (cRes.status === "fulfilled" && cRes.value.ok) contracts = await cRes.value.json();
        if (oRes.status === "fulfilled" && oRes.value.ok) obls = await oRes.value.json();
        if (rRes.status === "fulfilled" && rRes.value.ok) renewals = await rRes.value.json();

        const active = Array.isArray(contracts)
          ? contracts.filter((c) => (c.status || "").toLowerCase() === "active").length : 0;
        const dueSoon = Array.isArray(obls)
          ? obls.filter((o) => ["due", "due soon", "pending"].includes((o.status || "").toLowerCase())).length : 0;
        const overdue = Array.isArray(obls)
          ? obls.filter((o) => (o.status || "").toLowerCase() === "overdue").length : 0;

        setKpis({ contracts: active, obligations: dueSoon, overdue, renewals: Array.isArray(renewals) ? renewals.length : 0 });
        setObligations(Array.isArray(obls) ? obls.slice(0, 5) : []);
      } catch (err) {
        console.warn("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="page-title">Welcome back, {firstName}</div>
      <div className="page-sub">Here's what's happening across your contract portfolio today.</div>

      <div className="kpi-grid">
        <Kpi Icon={FileIcon}     color="#3B82F6" val={kpis.contracts}   label="Active Contracts"      loading={loading} />
        <Kpi Icon={AlertTriIcon} color="#F59E0B" val={kpis.obligations} label="Obligations Due"        loading={loading} />
        <Kpi Icon={InfoIcon}     color="#EF4444" val={kpis.overdue}     label="Overdue Obligations"   loading={loading} />
        <Kpi Icon={RepeatIcon}   color="#10B981" val={kpis.renewals}    label="Active Renewals"       loading={loading} />
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div className="section-title">Upcoming Obligations</div>
        {loading ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 13, padding: "20px 0" }}>Loading…</p>
        ) : obligations.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
            No obligations yet — data will appear once records are added.
          </p>
        ) : (
          <table>
            <thead>
              <tr><th>Obligation</th><th>Owner</th><th>Due Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {obligations.map((o) => (
                <tr key={o.id}>
                  <td>{o.title || "—"}</td>
                  <td>{o.owner_name || o.owner || "—"}</td>
                  <td>{o.due_date ? new Date(o.due_date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}</td>
                  <td>{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
