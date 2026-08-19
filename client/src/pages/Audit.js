import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Download,
  FilePlus2,
  Filter,
  LockKeyhole,
  Pencil,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import "./Audit.css";
import { API_BASE } from "../config/api";
const API_BASE_URL = API_BASE;

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "security", label: "Security" },
  { key: "approve", label: "Approval" },
  { key: "reject", label: "Rejected" },
  { key: "create", label: "Create" },
  { key: "update", label: "Update" },
  { key: "delete", label: "Delete" },
  { key: "export", label: "Export" },
];

const getEventType = (log) => {
  return String(
    log?.event_type ||
      log?.type ||
      log?.category ||
      log?.action_type ||
      log?.module ||
      ""
  ).toLowerCase();
};

const getLogIcon = (type) => {
  switch (type) {
    case "security":
      return LockKeyhole;

    case "approval":
    case "approve":
      return CheckCircle2;

    case "reject":
      return X;

    case "create":
      return FilePlus2;

    case "update":
      return Pencil;

    case "delete":
      return Trash2;

    case "export":
      return Download;

    case "ai":
    case "ai_action":
    case "ai actions":
      return Sparkles;

    default:
      return ShieldCheck;
  }
};

const getInitials = (name) => {
  if (!name) return "SY";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const formatDateTime = (value) => {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getRelativeTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const difference = Date.now() - date.getTime();
  const seconds = Math.floor(difference / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return formatDateTime(value);
};

const normalizeResponse = (responseData) => {
  if (Array.isArray(responseData)) {
    return {
      logs: responseData,
      summary: null,
      pagination: null,
    };
  }

  return {
    logs:
      responseData?.logs ||
      responseData?.items ||
      responseData?.results ||
      responseData?.data ||
      [],
    summary:
      responseData?.summary ||
      responseData?.statistics ||
      responseData?.stats ||
      null,
    pagination: responseData?.pagination || null,
  };
};

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState(null);

  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [moduleFilter, setModuleFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");

  const fetchAuditLogs = useCallback(async () => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError("");

      const query = new URLSearchParams();

      if (selectedFilter !== "all") {
        query.set("event_type", selectedFilter);
      }

      if (moduleFilter.trim()) {
        query.set("module", moduleFilter.trim());
      }

      if (startDate) {
        query.set("start_date", startDate);
      }

      if (endDate) {
        query.set("end_date", endDate);
      }

      const queryString = query.toString();

      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const response = await fetch(
        `${API_BASE_URL}/audit-logs${queryString ? `?${queryString}` : ""}`,
        {
          method: "GET",
          headers,
          credentials: "include",
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        let message = "Unable to load audit logs.";

        try {
          const responseError = await response.json();
          message =
            responseError?.detail ||
            responseError?.message ||
            responseError?.error ||
            message;
        } catch {
          // Keep the default error message.
        }

        throw new Error(message);
      }

      const responseData = await response.json();
      const normalized = normalizeResponse(responseData);

      setLogs(Array.isArray(normalized.logs) ? normalized.logs : []);
      setSummary(normalized.summary);
      setPagination(normalized.pagination);
    } catch (requestError) {
      if (requestError.name !== "AbortError") {
        setLogs([]);
        setSummary(null);
        setPagination(null);
        setError(requestError.message || "Unable to load audit logs.");
      }
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [selectedFilter, moduleFilter, startDate, endDate]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const calculatedSummary = useMemo(() => {
    const totalEvents = logs.length;

    const securityEvents = logs.filter(
      (log) => getEventType(log) === "security"
    ).length;

    const approvals = logs.filter((log) => {
      const type = getEventType(log);
      return type === "approval" || type === "approve";
    }).length;

    const aiActions = logs.filter((log) => {
      const type = getEventType(log);
      const moduleName = String(log?.module || "").toLowerCase();

      return (
        type === "ai" ||
        type === "ai_action" ||
        type === "ai actions" ||
        moduleName.includes("ai")
      );
    }).length;

    return {
      total_events: totalEvents,
      security_events: securityEvents,
      approvals,
      ai_actions: aiActions,
    };
  }, [logs]);

  const dashboardSummary = {
    total_events:
      summary?.total_events ??
      summary?.total ??
      pagination?.total ??
      calculatedSummary.total_events,

    security_events:
      summary?.security_events ??
      summary?.security ??
      calculatedSummary.security_events,

    approvals:
      summary?.approvals ??
      summary?.approval_events ??
      calculatedSummary.approvals,

    ai_actions:
      summary?.ai_actions ??
      summary?.ai_events ??
      calculatedSummary.ai_actions,
  };

  const clearAdvancedFilters = () => {
    setModuleFilter("");
    setStartDate("");
    setEndDate("");
  };

  const exportAuditLogs = async () => {
    try {
      setExporting(true);
      setError("");

      const query = new URLSearchParams();

      if (selectedFilter !== "all") {
        query.set("event_type", selectedFilter);
      }

      if (moduleFilter.trim()) {
        query.set("module", moduleFilter.trim());
      }

      if (startDate) {
        query.set("start_date", startDate);
      }

      if (endDate) {
        query.set("end_date", endDate);
      }

      query.set("format", "csv");
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(
        `${API_BASE_URL}/audit-logs/export?${query.toString()}`,
        {
          method: "GET",
          headers,
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to export audit logs.");
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = fileUrl;
      link.download = `audit-logs-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (exportError) {
      setError(exportError.message || "Unable to export audit logs.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="audit-page">
      <header className="audit-page-header">
        <div className="audit-heading-group">
          <h1>Audit Logs</h1>

          <p>
            Complete activity trail — user actions, security events, and system
            changes
          </p>
        </div>

        <div className="audit-header-actions">
          <button
            type="button"
            className={`audit-outline-button ${
              showFilters ? "is-active" : ""
            }`}
            onClick={() => setShowFilters((current) => !current)}
          >
            <Filter size={16} aria-hidden="true" />
            Filters
          </button>

          <button
            type="button"
            className="audit-outline-button"
            onClick={exportAuditLogs}
            disabled={exporting || loading}
          >
            <Download size={16} aria-hidden="true" />
            {exporting ? "Exporting..." : "Export"}
          </button>
        </div>
      </header>

      {showFilters && (
        <section className="audit-advanced-filters" aria-label="Audit filters">
          <div className="audit-filter-field">
            <label htmlFor="audit-module-filter">Module</label>

            <input
              id="audit-module-filter"
              type="text"
              value={moduleFilter}
              onChange={(event) => setModuleFilter(event.target.value)}
              placeholder="Authentication, contracts..."
            />
          </div>

          <div className="audit-filter-field">
            <label htmlFor="audit-start-date">From date</label>

            <input
              id="audit-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>

          <div className="audit-filter-field">
            <label htmlFor="audit-end-date">To date</label>

            <input
              id="audit-end-date"
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>

          <button
            type="button"
            className="audit-clear-filter-button"
            onClick={clearAdvancedFilters}
            disabled={!moduleFilter && !startDate && !endDate}
          >
            <X size={15} aria-hidden="true" />
            Clear
          </button>
        </section>
      )}

      <section className="audit-stat-grid" aria-label="Audit log statistics">
        <article className="audit-stat-card">
          <div>
            <span className="audit-stat-label">Total Events</span>
            <strong>{dashboardSummary.total_events}</strong>
          </div>

          <span className="audit-stat-icon audit-stat-icon-total">
            <BookOpen size={21} aria-hidden="true" />
          </span>
        </article>

        <article className="audit-stat-card">
          <div>
            <span className="audit-stat-label">Security Events</span>
            <strong>{dashboardSummary.security_events}</strong>
          </div>

          <span className="audit-stat-icon audit-stat-icon-security">
            <LockKeyhole size={21} aria-hidden="true" />
          </span>
        </article>

        <article className="audit-stat-card">
          <div>
            <span className="audit-stat-label">Approvals</span>
            <strong>{dashboardSummary.approvals}</strong>
          </div>

          <span className="audit-stat-icon audit-stat-icon-approval">
            <CheckCircle2 size={21} aria-hidden="true" />
          </span>
        </article>

        <article className="audit-stat-card">
          <div>
            <span className="audit-stat-label">AI Actions</span>
            <strong>{dashboardSummary.ai_actions}</strong>
          </div>

          <span className="audit-stat-icon audit-stat-icon-ai">
            <Sparkles size={21} aria-hidden="true" />
          </span>
        </article>
      </section>

      <nav className="audit-filter-tabs" aria-label="Audit event categories">
        {FILTER_OPTIONS.map((option) => (
          <button
            type="button"
            key={option.key}
            className={`audit-filter-tab ${
              selectedFilter === option.key ? "is-selected" : ""
            }`}
            onClick={() => setSelectedFilter(option.key)}
            aria-pressed={selectedFilter === option.key}
          >
            {option.label}
          </button>
        ))}
      </nav>

      <section className="audit-log-panel">
        {loading && (
          <div className="audit-state">
            <RefreshCw
              className="audit-loading-icon"
              size={25}
              aria-hidden="true"
            />
            <h3>Loading audit logs</h3>
            <p>Please wait while the latest activity is retrieved.</p>
          </div>
        )}

        {!loading && error && (
          <div className="audit-state audit-error-state">
            <ShieldCheck size={28} aria-hidden="true" />
            <h3>Could not load audit logs</h3>
            <p>{error}</p>

            <button
              type="button"
              className="audit-retry-button"
              onClick={fetchAuditLogs}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {!loading && !error && logs.length === 0 && (
          <div className="audit-state">
            <BookOpen size={30} aria-hidden="true" />
            <h3>No audit logs found</h3>
            <p>
              There are no activities matching the selected filters.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          logs.map((log, index) => {
            const type = getEventType(log);
            const EventIcon = getLogIcon(type);

            const userName =
              log?.user_name ||
              log?.actor_name ||
              log?.actor ||
              log?.user?.name ||
              log?.user?.full_name ||
              "System";

            const action = log?.action || "Performed an action";

            const target =
              log?.target ||
              log?.target_name ||
              log?.resource_name ||
              log?.description ||
              "";

            const ipAddress =
              log?.ip_address || log?.ip || "Not recorded";

            const createdAt =
              log?.created_at ||
              log?.timestamp ||
              log?.time ||
              log?.occurred_at;

            const eventLabel = type || "system";

            return (
              <article
                className="audit-log-row"
                key={log?.id ?? `${createdAt}-${index}`}
              >
                <div
                  className={`audit-event-icon audit-event-icon-${eventLabel}`}
                >
                  <EventIcon size={17} aria-hidden="true" />
                </div>

                <div className="audit-log-avatar" aria-hidden="true">
                  {getInitials(userName)}
                </div>

                <div className="audit-log-content">
                  <div className="audit-log-main-line">
                    <strong>{userName}</strong>

                    <span className="audit-log-action">{action}</span>

                    {target && (
                      <span className="audit-log-target">{target}</span>
                    )}

                    <span
                      className={`audit-event-badge audit-event-badge-${eventLabel}`}
                    >
                      {eventLabel.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div className="audit-log-meta">
                    <span>IP: {ipAddress}</span>

                    {log?.module && <span>Module: {log.module}</span>}

                    <span className="audit-exact-time">
                      {formatDateTime(createdAt)}
                    </span>
                  </div>
                </div>

                <time
                  className="audit-relative-time"
                  dateTime={createdAt || undefined}
                  title={formatDateTime(createdAt)}
                >
                  {getRelativeTime(createdAt)}
                </time>
              </article>
            );
          })}
      </section>
    </section>
  );
}
