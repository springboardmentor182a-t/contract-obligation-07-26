import React from "react";

function ViewRenewalModal({ renewal, onClose }) {
  if (!renewal) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "420px",
          maxWidth: "90%",
          borderRadius: 12,
          padding: 24,
          boxSizing: "border-box",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              color: "#222",
            }}
          >
            Renewal Details
          </h2>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              fontSize: 24,
              cursor: "pointer",
              color: "#666",
            }}
          >
            ×
          </button>
        </div>

        {/* DETAILS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <strong>Contract:</strong>
            <div style={{ marginTop: 4, color: "#555" }}>
              {renewal.contract_name || "N/A"}
            </div>
          </div>

          <div>
            <strong>Client:</strong>
            <div style={{ marginTop: 4, color: "#555" }}>
              {renewal.client_name || "N/A"}
            </div>
          </div>

          <div>
            <strong>Renewal Type:</strong>
            <div style={{ marginTop: 4, color: "#555" }}>
              {renewal.renewal_type || "N/A"}
            </div>
          </div>

          <div>
            <strong>Renewal Date:</strong>
            <div style={{ marginTop: 4, color: "#555" }}>
              {renewal.renewal_date
                ? new Date(
                    renewal.renewal_date
                  ).toLocaleDateString()
                : "N/A"}
            </div>
          </div>

          <div>
            <strong>Reminder Days:</strong>
            <div style={{ marginTop: 4, color: "#555" }}>
              {renewal.reminder_days ?? "N/A"}
            </div>
          </div>

          <div>
            <strong>Status:</strong>
            <div style={{ marginTop: 4, color: "#555" }}>
              {renewal.status || "N/A"}
            </div>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            marginTop: 22,
            width: "100%",
            background: "#6C4CFF",
            color: "#fff",
            border: "none",
            padding: "10px",
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ViewRenewalModal;