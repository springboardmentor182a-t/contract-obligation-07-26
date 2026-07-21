
import { useEffect, useMemo, useState } from "react";
import "./Obligations.css";
import { STATUS_COLORS, STATUS_LABELS } from "../data/constants";
import ButtonGroup from "../components/Buttons/ButtonGroup";
import Checkbox from "../components/Form/Checkbox";

const API_URL = "/api/obligations/";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "due", label: "Due Soon" },
  { key: "overdue", label: "Overdue" },
  { key: "ontrack", label: "On Track" },
  { key: "completed", label: "Completed" },
];

function normalizeStatus(status) {
  const value = String(status || "").trim().toLowerCase();

  if (value === "completed" || value === "complete" || value === "done") {
    return "completed";
  }

  if (value === "overdue") {
    return "overdue";
  }

  if (
    value === "due" ||
    value === "due soon" ||
    value === "due_soon" ||
    value === "pending"
  ) {
    return "due";
  }

  return "ontrack";
}

function formatDate(dateValue) {
  if (!dateValue) return "No due date";

  const date = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Obligations() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchObligations() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load obligations (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid obligations response");
        }

        const formattedItems = data.map((item) => {
          const normalizedStatus = normalizeStatus(item.status);

          return {
            id: item.id,
            title: item.title || "Untitled Obligation",
            description: item.description || "",
            contract: item.contract_name
              ? item.contract_name
              : `Contract #${item.contract_id}`,
            owner: item.owner_name
              ? item.owner_name
              : `Owner #${item.owner_id}`,
            due: formatDate(item.due_date),
            status:
              normalizedStatus === "completed"
                ? "ontrack"
                : normalizedStatus,
            completed: normalizedStatus === "completed",
            priority: item.priority || "Medium",
          };
        });

        if (isMounted) {
          setItems(formattedItems);
        }
      } catch (fetchError) {
        console.error("Failed to fetch obligations:", fetchError);

        if (isMounted) {
          setError(fetchError.message || "Unable to load obligations.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchObligations();

    return () => {
      isMounted = false;
    };
  }, []);

  function toggle(id) {
    const obligation = items.find((item) => item.id === id);

    if (!obligation) return;

    const previousCompleted = obligation.completed;
    const previousStatus = obligation.status;
    const newCompleted = !previousCompleted;

    const newStatus = newCompleted ? "completed" : "on_track";

    setError("");

    setItems((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: newCompleted,
              status: newCompleted ? "ontrack" : "ontrack",
            }
          : item
      )
    );

    fetch(`${API_URL}${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .catch(() => null)
            .then((errorData) => {
              throw new Error(
                errorData?.detail ||
                  `Unable to update obligation (${response.status})`
              );
            });
        }

        return response.json();
      })
      .then((updatedObligation) => {
        const normalizedStatus = normalizeStatus(
          updatedObligation.status
        );

        setItems((list) =>
          list.map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed: normalizedStatus === "completed",
                  status:
                    normalizedStatus === "completed"
                      ? "ontrack"
                      : normalizedStatus,
                }
              : item
          )
        );
      })
      .catch((updateError) => {
        console.error(
          "Failed to update obligation:",
          updateError
        );

        setItems((list) =>
          list.map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed: previousCompleted,
                  status: previousStatus,
                }
              : item
          )
        );

        setError(
          updateError.message ||
            "Unable to update obligation status."
        );
      });
  }

  const filtered = useMemo(() => {
    return items.filter((obligation) => {
      if (filter === "all") return true;
      if (filter === "completed") return obligation.completed;

      return (
        !obligation.completed &&
        obligation.status === filter
      );
    });
  }, [items, filter]);

  const dueCount = items.filter(
    (obligation) =>
      !obligation.completed && obligation.status === "due"
  ).length;

  const overdueCount = items.filter(
    (obligation) =>
      !obligation.completed && obligation.status === "overdue"
  ).length;

  const doneCount = items.filter(
    (obligation) => obligation.completed
  ).length;

  return (
    <div className="page-surface obligations-page">
      <h2>Obligation Tracker</h2>
      <p className="muted">
        Track obligations, deadlines and owners.
      </p>

      <div className="kpi-grid" style={{ marginTop: 18 }}>
        <div className="kpi-card">
          <div className="kpi-val">{items.length}</div>
          <div className="kpi-lbl">Total Obligations</div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-val"
            style={{ color: STATUS_COLORS.due }}
          >
            {dueCount}
          </div>
          <div className="kpi-lbl">Due Soon</div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-val"
            style={{ color: STATUS_COLORS.overdue }}
          >
            {overdueCount}
          </div>
          <div className="kpi-lbl">Overdue</div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-val"
            style={{ color: STATUS_COLORS.ontrack }}
          >
            {doneCount}
          </div>
          <div className="kpi-lbl">Completed</div>
        </div>
      </div>

      <ButtonGroup
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      <div className="obligation-list">
        {loading && (
          <p className="muted" style={{ padding: 20 }}>
            Loading obligations...
          </p>
        )}

        {!loading && error && (
          <p className="muted" style={{ padding: 20 }}>
            {error}
          </p>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p className="muted" style={{ padding: 20 }}>
            Nothing in this view.
          </p>
        )}

        {!loading &&
          !error &&
          filtered.map((obligation) => (
            <div
              className={
                "task-row" +
                (obligation.completed ? " done" : "")
              }
              key={obligation.id}
            >
              <Checkbox
                variant="check"
                checked={obligation.completed}
                onChange={() => toggle(obligation.id)}
              />

              <div style={{ flex: 1 }}>
                <div className="task-title">
                  {obligation.title}
                </div>

                <div className="task-meta">
                  {obligation.contract} · Owner:{" "}
                  {obligation.owner}
                </div>

                <div
                  className="task-meta"
                  style={{ marginTop: 4 }}
                >
                  <span
                    className="status-dot"
                    style={{
                      background:
                        STATUS_COLORS[obligation.status],
                    }}
                  />
                  Due {obligation.due} ·{" "}
                  {STATUS_LABELS[obligation.status]}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

