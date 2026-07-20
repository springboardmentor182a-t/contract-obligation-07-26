import { useState } from "react";
import "./Obligations.css";
import { STATUS_COLORS, STATUS_LABELS } from "../data/constants";
import ButtonGroup from "../components/Buttons/ButtonGroup";
import Checkbox from "../components/Form/Checkbox";

const SEED = [
  { id: 1, title: "Vendor SLA Renewal", contract: "MSA \u2014 Cloudline Inc.", owner: "Priya N.", due: "Jul 12, 2026", status: "due", completed: false },
  { id: 2, title: "Data Processing Addendum Review", contract: "DPA \u2014 Northbridge Ltd.", owner: "Arjun Mehta", due: "Jul 15, 2026", status: "due", completed: false },
  { id: 3, title: "Insurance Certificate Submission", contract: "Vendor Agreement \u2014 SafeHaul", owner: "Karan S.", due: "Jul 3, 2026", status: "overdue", completed: false },
  { id: 4, title: "Payment Milestone \u2014 Phase 2", contract: "Services Agreement \u2014 Prism Co.", owner: "Meera R.", due: "Aug 1, 2026", status: "ontrack", completed: false },
  { id: 5, title: "Quarterly Audit Log Export", contract: "Audit Engagement \u2014 Deloitte", owner: "Arjun Mehta", due: "Jul 22, 2026", status: "ontrack", completed: true },
  { id: 6, title: "Termination Notice Window Check", contract: "NDA \u2014 Partner Co.", owner: "Karan S.", due: "Jun 30, 2026", status: "overdue", completed: false },
];

const FILTERS = [
  { key: "all", label: "All" },
  { key: "due", label: "Due Soon" },
  { key: "overdue", label: "Overdue" },
  { key: "ontrack", label: "On Track" },
  { key: "completed", label: "Completed" },
];

export default function Obligations() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(SEED);

  function toggle(id) {
    setItems((list) => list.map((o) => (o.id === id ? { ...o, completed: !o.completed } : o)));
  }

  const filtered = items.filter((o) => {
    if (filter === "all") return true;
    if (filter === "completed") return o.completed;
    return !o.completed && o.status === filter;
  });

  const dueCount = items.filter((o) => !o.completed && o.status === "due").length;
  const overdueCount = items.filter((o) => !o.completed && o.status === "overdue").length;
  const doneCount = items.filter((o) => o.completed).length;

  return (
    <div className="page-surface obligations-page">
      <h2>Obligation Tracker</h2>
      <p className="muted">Track obligations, deadlines and owners.</p>

      <div className="kpi-grid" style={{ marginTop: 18 }}>
        <div className="kpi-card"><div className="kpi-val">{items.length}</div><div className="kpi-lbl">Total Obligations</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: STATUS_COLORS.due }}>{dueCount}</div><div className="kpi-lbl">Due Soon</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: STATUS_COLORS.overdue }}>{overdueCount}</div><div className="kpi-lbl">Overdue</div></div>
        <div className="kpi-card"><div className="kpi-val" style={{ color: STATUS_COLORS.ontrack }}>{doneCount}</div><div className="kpi-lbl">Completed</div></div>
      </div>

      <ButtonGroup options={FILTERS} value={filter} onChange={setFilter} />

      <div className="obligation-list">
        {filtered.length === 0 && <p className="muted" style={{ padding: 20 }}>Nothing in this view.</p>}
        {filtered.map((o) => (
          <div className={"task-row" + (o.completed ? " done" : "")} key={o.id}>
            <Checkbox variant="check" checked={o.completed} onChange={() => toggle(o.id)} />
            <div style={{ flex: 1 }}>
              <div className="task-title">{o.title}</div>
              <div className="task-meta">{o.contract} \u00b7 Owner: {o.owner}</div>
              <div className="task-meta" style={{ marginTop: 4 }}>
                <span className="status-dot" style={{ background: STATUS_COLORS[o.status] }} />
                Due {o.due} \u00b7 {STATUS_LABELS[o.status]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
