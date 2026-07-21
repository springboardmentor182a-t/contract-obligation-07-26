import React, { useEffect, useState, useCallback } from "react";
import PageContainer from "../layout/PageContainer";
import Modal from "../components/Modals/Modal";
import ObligationTable from "../features/obligations/components/ObligationTable";
import ObligationForm from "../features/obligations/components/ObligationForm";
import { listObligations, getObligationStats, updateObligation } from "../features/obligations/services/obligationsApi";
import { listContracts } from "../features/contracts/services/contractsApi";

const ICONS = {
  total: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  ),
  completed: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  ),
  in_progress: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  due_soon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  overdue: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const ICON_BG = {
  total: "#EDE9FE",
  completed: "#DCFCE7",
  in_progress: "#DBEAFE",
  due_soon: "#FEF3C7",
  overdue: "#FEE2E2",
};

function StatCard({ label, value, accent, icon }) {
  return (
    <div className="card" style={{ flex: 1, minWidth: 150, display: "flex", alignItems: "flex-start", gap: 14 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: ICON_BG[icon] || "#EDE9FE",
          color: accent || "var(--color-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {ICONS[icon]}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "var(--color-text-muted)" }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: accent || "var(--color-text)" }}>{value}</div>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "not_started", label: "Not Started" },
  { value: "in_progress", label: "In Progress" },
  { value: "due_soon", label: "Due Soon" },
  { value: "completed", label: "Completed" },
  { value: "overdue", label: "Overdue" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function Obligations() {
  const [obligations, setObligations] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [contractFilter, setContractFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const loadData = useCallback(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status_filter = statusFilter;
    if (contractFilter) params.contract_id = contractFilter;

    Promise.all([listObligations(params), getObligationStats(), listContracts({ limit: 100 })])
      .then(([o, s, c]) => {
        setObligations(o);
        setStats(s);
        setContracts(c);
      })
      .finally(() => setLoading(false));
  }, [search, statusFilter, contractFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
    setContractFilter("");
    setPage(1);
  }

  async function handleDelete(obligation) {
    if (!window.confirm(`Remove "${obligation.title}"?`)) return;
    setObligations((prev) => prev.filter((o) => o.id !== obligation.id));
  }

  async function handleMarkComplete(obligation) {
    await updateObligation(obligation.id, { status: "completed" });
    loadData();
  }

  const filteredByPriority = priorityFilter
    ? obligations.filter((o) => o.priority === priorityFilter)
    : obligations;

  const totalPages = Math.max(1, Math.ceil(filteredByPriority.length / pageSize));
  const pageItems = filteredByPriority.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PageContainer title="Obligation Management" subtitle="View, manage and track all contract obligations in one place.">
      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total Obligations" value={stats?.total_obligations ?? 0} icon="total" />
        <StatCard label="Completed" value={stats?.completed ?? 0} accent="var(--color-success)" icon="completed" />
        <StatCard label="In Progress" value={stats?.in_progress ?? 0} accent="var(--color-info)" icon="in_progress" />
        <StatCard label="Due Soon" value={stats?.due_soon ?? 0} accent="var(--color-warning)" icon="due_soon" />
        <StatCard label="Overdue" value={stats?.overdue ?? 0} accent="var(--color-danger)" icon="overdue" />
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>All Obligations</h3>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Obligation
          </button>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <input
            placeholder="Search obligations..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "8px 12px", fontSize: 13, minWidth: 200 }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "8px 12px", fontSize: 13 }}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "8px 12px", fontSize: 13 }}
          >
            <option value="">All Priority</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          <select
            value={contractFilter}
            onChange={(e) => {
              setContractFilter(e.target.value);
              setPage(1);
            }}
            style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: "8px 12px", fontSize: 13 }}
          >
            <option value="">All Contracts</option>
            {contracts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="btn btn-outline" onClick={clearFilters}>
            Clear
          </button>
        </div>

        {loading ? (
          <p>Loading obligations...</p>
        ) : (
          <>
            <ObligationTable obligations={pageItems} onDelete={handleDelete} onEdit={handleMarkComplete} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, fontSize: 13, color: "var(--color-text-muted)" }}>
              <span>
                Showing {filteredByPriority.length === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredByPriority.length)} of {filteredByPriority.length} obligations
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                  Prev
                </button>
                <span style={{ padding: "6px 10px" }}>
                  Page {page} of {totalPages}
                </span>
                <button className="btn btn-outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Obligation">
        <ObligationForm
          contracts={contracts}
          onCancel={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadData();
          }}
        />
      </Modal>
    </PageContainer>
  );
}