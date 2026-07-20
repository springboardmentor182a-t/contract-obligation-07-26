import React from "react";
import { formatDate, daysRemaining } from "../../../utils/formatDate";

const STATUS_BADGE = {
  completed: "badge-active",
  in_progress: "badge-pending",
  due_soon: "badge-expiring",
  overdue: "badge-expired",
  not_started: "badge-draft",
};

const STATUS_LABEL = {
  completed: "Completed",
  in_progress: "In Progress",
  due_soon: "Due Soon",
  overdue: "Overdue",
  not_started: "Not Started",
};

const PRIORITY_DOT = {
  high: "#DC2626",
  medium: "#D97706",
  low: "#6B7280",
};

function OwnerAvatar({ name }) {
  const initial = (name || "U").charAt(0).toUpperCase();

  return (
    <div
      title={name || "Unassigned"}
      style={{
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: "var(--color-primary)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: 12,
      }}
    >
      {initial}
    </div>
  );
}

export default function ObligationTable({
  obligations = [],
  onView,
  onEdit,
  onDelete,
}) {
  return (
    <div
      style={{
        overflowX: "auto",
        border: "1px solid var(--color-border)",
        borderRadius: 10,
        background: "#fff",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          minWidth: 1100,
        }}
      >
        <thead>
          <tr
            style={{
              background: "#F8FAFC",
              borderBottom: "2px solid var(--color-border)",
            }}
          >
            <th style={styles.head}>Obligation</th>
            <th style={styles.head}>Contract</th>
            <th style={styles.head}>Type</th>
            <th style={styles.head}>Owner</th>
            <th style={styles.head}>Due Date</th>
            <th style={styles.head}>Status</th>
            <th style={styles.head}>Priority</th>
            <th style={styles.head}>Progress</th>
            <th style={styles.head}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {obligations.length > 0 ? (
            obligations.map((o) => {
              const remaining = daysRemaining(o.due_date);

              return (
                <tr
                  key={o.id}
                  style={{
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <td style={styles.cell}>
                    <strong>{o.title}</strong>
                  </td>

                  <td style={styles.cell}>
                    {o.contract_name || "-"}
                  </td>

                  <td style={styles.cell}>
                    {(o.obligation_type || "-").replace("_", " ")}
                  </td>

                  <td style={styles.cell}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <OwnerAvatar name={o.owner_name} />
                      <span>{o.owner_name || "Unassigned"}</span>
                    </div>
                  </td>

                  <td style={styles.cell}>
                    <div>{formatDate(o.due_date)}</div>

                    {remaining !== null && (
                      <small
                        style={{
                          color:
                            remaining < 0
                              ? "#DC2626"
                              : "var(--color-text-muted)",
                        }}
                      >
                        {remaining < 0
                          ? `${Math.abs(remaining)} days overdue`
                          : `${remaining} days left`}
                      </small>
                    )}
                  </td>

                  <td style={styles.cell}>
                    <span
                      className={`badge ${
                        STATUS_BADGE[o.status] || "badge-draft"
                      }`}
                    >
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>

                  <td style={styles.cell}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textTransform: "capitalize",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background:
                            PRIORITY_DOT[o.priority] || "#6B7280",
                        }}
                      />

                      {o.priority}
                    </div>
                  </td>

                  <td style={styles.cell}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <div
                        style={{
                          width: 90,
                          height: 8,
                          background: "#E5E7EB",
                          borderRadius: 20,
                        }}
                      >
                        <div
                          style={{
                            width: `${o.progress_percent || 0}%`,
                            height: "100%",
                            borderRadius: 20,
                            background: "var(--color-primary)",
                          }}
                        />
                      </div>

                      <span>{o.progress_percent || 0}%</span>
                    </div>
                  </td>

                  <td style={styles.cell}>
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          color: "#2563EB",
                          cursor: "pointer",
                        }}
                        onClick={() => onView?.(o)}
                      >
                        View
                      </span>

                      <span
                        style={{
                          color: "#16A34A",
                          cursor: "pointer",
                        }}
                        onClick={() => onEdit?.(o)}
                      >
                        Complete
                      </span>

                      <span
                        style={{
                          color: "#DC2626",
                          cursor: "pointer",
                        }}
                        onClick={() => onDelete?.(o)}
                      >
                        Delete
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan="9"
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#6B7280",
                }}
              >
                No obligations tracked yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  head: {
    padding: "14px",
    textAlign: "left",
    fontSize: 13,
    fontWeight: 700,
    color: "#374151",
  },

  cell: {
    padding: "14px",
    verticalAlign: "middle",
    fontSize: 14,
  },
};