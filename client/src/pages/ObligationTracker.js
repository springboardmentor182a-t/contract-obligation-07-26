import { useState } from "react";
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle } from "lucide-react";
import { PageContainer } from "../layout/PageContainer";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "../hooks/useFetch";
import { listObligations, updateCompletionStatus } from "../features/obligations/services/obligations";
import { IconStatCard } from "../components/IconStatCard";
import { DoughnutChart } from "../components/Charts/DoughnutChart";
import { getBadgeClass, formatStatusLabel } from "../utils/statusBadge";
import "./Dashboard.css";

const COMPLETION_OPTIONS = ["", "pending", "in_progress", "completed", "overdue"];

export function ObligationTracker() {
  const { token } = useAuth();
  const [completionStatus, setCompletionStatus] = useState("");
  const [overdueOnly, setOverdueOnly] = useState(false);

  const { data: allObligations } = useFetch(() => listObligations(token, {}), []);
  const { data: obligations, loading, error, refetch } = useFetch(
    () => listObligations(token, { completion_status: completionStatus, overdue_only: overdueOnly }),
    [completionStatus, overdueOnly]
  );

  const handleMarkComplete = async (id) => {
    await updateCompletionStatus(token, id, "completed");
    refetch();
  };

  const statusCounts = { pending: 0, in_progress: 0, completed: 0, overdue: 0 };
  (allObligations || []).forEach((o) => {
    statusCounts[o.completion_status] = (statusCounts[o.completion_status] || 0) + 1;
  });

  return (
    <PageContainer title="Obligation Tracker">
      <div className="dashboard-stat-grid">
        <IconStatCard icon={<ClipboardList size={20} />} color="blue" label="Total Obligations" value={(allObligations || []).length} />
        <IconStatCard icon={<Clock3 size={20} />} color="orange" label="Pending" value={statusCounts.pending} />
        <IconStatCard icon={<CheckCircle2 size={20} />} color="green" label="Completed" value={statusCounts.completed} />
        <IconStatCard icon={<AlertTriangle size={20} />} color="orange" label="Overdue" value={statusCounts.overdue} />
      </div>

      <div className="dashboard-row" style={{ gridTemplateColumns: "1fr 2fr" }}>
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="dashboard-panel-title">Completion Breakdown</h3>
          </div>
          {(allObligations || []).length > 0 ? (
            <DoughnutChart
              labels={["Pending", "In Progress", "Completed", "Overdue"]}
              data={[statusCounts.pending, statusCounts.in_progress, statusCounts.completed, statusCounts.overdue]}
              colors={["#F59E0B", "#3B82F6", "#22C55E", "#EF4444"]}
              height={180}
            />
          ) : <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>No obligations yet.</p>}
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <h3 className="dashboard-panel-title">Progress Tracking</h3>
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <select className="form-input" value={completionStatus} onChange={(e) => setCompletionStatus(e.target.value)}>
              {COMPLETION_OPTIONS.map((s) => (
                <option key={s} value={s}>{s ? formatStatusLabel(s) : "All Statuses"}</option>
              ))}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14 }}>
              <input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} />
              Overdue only
            </label>
          </div>

          {loading && <p>Loading obligations...</p>}
          {error && <p style={{ color: "var(--color-danger)" }}>{error.message}</p>}

          {!loading && !error && (
            <table className="deadline-table">
              <thead>
                <tr><th>Title</th><th>Type</th><th>Due Date</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {(obligations || []).map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>{o.title}</td>
                    <td>{formatStatusLabel(o.obligation_type)}</td>
                    <td>{o.due_date}</td>
                    <td><span className={`badge ${getBadgeClass(o.completion_status)}`}>{formatStatusLabel(o.completion_status)}</span></td>
                    <td>
                      {o.completion_status !== "completed" && (
                        <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => handleMarkComplete(o.id)}>
                          Mark Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {(obligations || []).length === 0 && (
                  <tr><td colSpan={5} style={{ color: "var(--color-text-secondary)", padding: "12px 0" }}>No obligations found.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
