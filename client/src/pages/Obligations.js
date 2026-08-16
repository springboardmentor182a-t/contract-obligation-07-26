import { useEffect, useMemo, useState } from "react";
import "./Obligations.css";
import {
  STATUS_COLORS,
  STATUS_LABELS,
} from "../data/constants";
import ButtonGroup from "../components/Buttons/ButtonGroup";
import Checkbox from "../components/Form/Checkbox";
import { API_BASE } from "../config/api";
import { getContracts } from "../services/contractAPI";
import { getUsers } from "../services/userAPI";
import { getAuthHeaders } from "../utils/auth";
import NewObligationModal from "../components/Modals/NewObligationModal";
const API_URL = `${API_BASE}/obligations/`;

const FILTERS = [
  { key: "all", label: "All" },
  { key: "due", label: "Due Soon" },
  { key: "overdue", label: "Overdue" },
  { key: "ontrack", label: "On Track" },
  { key: "completed", label: "Completed" },
];

const INITIAL_FORM = {
  title: "",
  description: "",
  contract_id: "",
  owner_id: "",
  priority: "Medium",
  status: "due",
  due_date: "",
};

function normalizeStatus(status) {
  const value = String(status || "")
    .trim()
    .toLowerCase();

  if (
    value === "completed" ||
    value === "complete" ||
    value === "done"
  ) {
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

function formatObligation(item) {
  const normalizedStatus = normalizeStatus(
    item.status
  );

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
    completed:
      normalizedStatus === "completed",
    priority: item.priority || "Medium",
  };
}

export default function Obligations() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] =
    useState(false);
  const [formData, setFormData] =
    useState(INITIAL_FORM);
  const [submitting, setSubmitting] =
    useState(false);
  const [contracts, setContracts] =
    useState([]);
  const [users, setUsers] = useState([]);
  const [formOptionsLoading, setFormOptionsLoading] =
    useState(true);
  const [formOptionsError, setFormOptionsError] =
    useState("");

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError("");

    fetch(API_URL, {
      headers: getAuthHeaders({
        Accept: "application/json",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Unable to load obligations (${response.status})`
          );
        }

        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid obligations response"
          );
        }

        if (isMounted) {
          setItems(
            data.map(formatObligation)
          );
        }
      })
      .catch((fetchError) => {
        console.error(
          "Failed to fetch obligations:",
          fetchError
        );

        if (isMounted) {
          setError(
            fetchError.message ||
              "Unable to load obligations."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    setFormOptionsLoading(true);
    setFormOptionsError("");

    Promise.all([
      getContracts(),
      getUsers(),
    ])
      .then(([
        contractData,
        userData,
      ]) => {
        if (
          !Array.isArray(contractData) ||
          !Array.isArray(userData)
        ) {
          throw new Error(
            "Invalid contract or user response"
          );
        }

        if (isMounted) {
          setContracts(contractData);
          setUsers(userData);
        }
      })
      .catch((optionsError) => {
        console.error(
          "Failed to load obligation form options:",
          optionsError
        );

        if (isMounted) {
          setFormOptionsError(
            "Unable to load contracts and assignees."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setFormOptionsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  function handleCreateObligation(event) {
    event.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.contract_id ||
      !formData.owner_id ||
      !formData.due_date
    ) {
      setError(
        "Title, Contract, Owner and Due Date are required."
      );

      return;
    }

    const requestBody = {
      title: formData.title.trim(),
      description:
        formData.description.trim() || null,
      contract_id: Number(
        formData.contract_id
      ),
      owner_id: Number(formData.owner_id),
      priority: formData.priority,
      status: formData.status,
      due_date: formData.due_date,
    };

    setSubmitting(true);
    setError("");

    fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders({
        "Content-Type":
          "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response
            .json()
            .catch(() => null)
            .then((errorData) => {
              throw new Error(
                errorData?.detail ||
                  `Unable to create obligation (${response.status})`
              );
            });
        }

        return response.json();
      })
      .then((createdObligation) => {
        const formattedObligation =
          formatObligation(
            createdObligation
          );

        setItems((currentItems) => [
          formattedObligation,
          ...currentItems,
        ]);

        setFormData(INITIAL_FORM);
        setShowForm(false);
        setFilter("all");
      })
      .catch((createError) => {
        console.error(
          "Failed to create obligation:",
          createError
        );

        setError(
          createError.message ||
            "Unable to create obligation."
        );
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  function toggle(id) {
    const obligation = items.find(
      (item) => item.id === id
    );

    if (!obligation) return;

    const previousCompleted =
      obligation.completed;
    const previousStatus =
      obligation.status;
    const newCompleted =
      !previousCompleted;

    const newStatus = newCompleted
      ? "completed"
      : "on_track";

    setError("");

    setItems((list) =>
      list.map((item) =>
        item.id === id
          ? {
              ...item,
              completed: newCompleted,
              status: "ontrack",
            }
          : item
      )
    );

    fetch(`${API_URL}${id}`, {
      method: "PATCH",
      headers: getAuthHeaders({
        "Content-Type":
          "application/json",
        Accept: "application/json",
      }),
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
        const normalizedStatus =
          normalizeStatus(
            updatedObligation.status
          );

        setItems((list) =>
          list.map((item) =>
            item.id === id
              ? {
                  ...item,
                  completed:
                    normalizedStatus ===
                    "completed",
                  status:
                    normalizedStatus ===
                    "completed"
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
                  completed:
                    previousCompleted,
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

  function deleteObligation(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this obligation?"
    );

    if (!confirmed) return;

    setError("");

    fetch(`${API_URL}${id}`, {
      method: "DELETE",
      headers: getAuthHeaders({
        Accept: "application/json",
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
                  `Unable to delete obligation (${response.status})`
              );
            });
        }

        setItems((currentItems) =>
          currentItems.filter(
            (item) => item.id !== id
          )
        );
      })
      .catch((deleteError) => {
        console.error(
          "Failed to delete obligation:",
          deleteError
        );

        setError(
          deleteError.message ||
            "Unable to delete obligation."
        );
      });
  }

  const filtered = useMemo(() => {
    return items.filter((obligation) => {
      if (filter === "all") return true;

      if (filter === "completed") {
        return obligation.completed;
      }

      return (
        !obligation.completed &&
        obligation.status === filter
      );
    });
  }, [items, filter]);

  const dueCount = items.filter(
    (obligation) =>
      !obligation.completed &&
      obligation.status === "due"
  ).length;

  const overdueCount = items.filter(
    (obligation) =>
      !obligation.completed &&
      obligation.status === "overdue"
  ).length;

  const doneCount = items.filter(
    (obligation) =>
      obligation.completed
  ).length;

  return (
    <div className="page-surface obligations-page">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <div>
          <h2>Obligation Tracker</h2>

          <p className="muted">
            Track obligations, deadlines
            and owners.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setShowForm(
              (currentValue) =>
                !currentValue
            );
            setError("");
          }}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          {showForm
            ? "Cancel"
            : "+ Add Obligation"}
        </button>
      </div>

      {showForm && (
        <NewObligationModal
          formData={formData}
          handleFormChange={handleFormChange}
          handleCreateObligation={handleCreateObligation}
          onClose={() => {
            setShowForm(false);
            setError("");
          }}
          submitting={submitting}
          formOptionsLoading={formOptionsLoading}
          formOptionsError={formOptionsError}
          contracts={contracts}
          users={users}
        />
      )}

      <div
        className="kpi-grid"
        style={{ marginTop: 18 }}
      >
        <div className="kpi-card">
          <div className="kpi-val">
            {items.length}
          </div>

          <div className="kpi-lbl">
            Total Obligations
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-val"
            style={{
              color:
                STATUS_COLORS.due,
            }}
          >
            {dueCount}
          </div>

          <div className="kpi-lbl">
            Due Soon
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-val"
            style={{
              color:
                STATUS_COLORS.overdue,
            }}
          >
            {overdueCount}
          </div>

          <div className="kpi-lbl">
            Overdue
          </div>
        </div>

        <div className="kpi-card">
          <div
            className="kpi-val"
            style={{
              color:
                STATUS_COLORS.ontrack,
            }}
          >
            {doneCount}
          </div>

          <div className="kpi-lbl">
            Completed
          </div>
        </div>
      </div>

      <ButtonGroup
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      <div className="obligation-list">
        {loading && (
          <p
            className="muted"
            style={{ padding: 20 }}
          >
            Loading obligations...
          </p>
        )}

        {!loading && error && (
          <p
            className="muted"
            style={{ padding: 20 }}
          >
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          filtered.length === 0 && (
            <p
              className="muted"
              style={{ padding: 20 }}
            >
              Nothing in this view.
            </p>
          )}

        {!loading &&
          !error &&
          filtered.map(
            (obligation) => (
              <div
                className={
                  "task-row" +
                  (obligation.completed
                    ? " done"
                    : "")
                }
                key={obligation.id}
              >
                <Checkbox
                  variant="check"
                  checked={
                    obligation.completed
                  }
                  onChange={() =>
                    toggle(
                      obligation.id
                    )
                  }
                />

                <div
                  style={{ flex: 1 }}
                >
                  <div className="task-title">
                    {obligation.title}
                  </div>

                  <div className="task-meta">
                    {
                      obligation.contract
                    }{" "}
                    · Owner:{" "}
                    {obligation.owner}
                  </div>

                  <div
                    className="task-meta"
                    style={{
                      marginTop: 4,
                    }}
                  >
                    <span
                      className="status-dot"
                      style={{
                        background:
                          STATUS_COLORS[
                            obligation
                              .status
                          ],
                      }}
                    />

                    Due {obligation.due} ·{" "}
                    {
                      STATUS_LABELS[
                        obligation.status
                      ]
                    }
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    deleteObligation(
                      obligation.id
                    )
                  }
                  style={{
                    background:
                      "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginLeft: "12px",
                  }}
                >
                  Delete
                </button>
              </div>
            )
          )}
      </div>
    </div>
  );
}
