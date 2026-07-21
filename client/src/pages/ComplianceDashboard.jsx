import React from "react";

const stats = [
  {
    title: "Total Contracts",
    value: "156",
    color: "#2563EB",
    icon: "📄",
  },
  {
    title: "Compliant",
    value: "132",
    color: "#22C55E",
    icon: "✅",
  },
  {
    title: "Pending Reviews",
    value: "18",
    color: "#F59E0B",
    icon: "⏳",
  },
  {
    title: "Violations",
    value: "6",
    color: "#EF4444",
    icon: "⚠️",
  },
];

const ComplianceDashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ color: "#2563EB", marginBottom: "5px" }}>
            Compliance Dashboard
          </h1>
          <p style={{ color: "#6B7280" }}>
            Monitor company-wide compliance and regulatory health.
          </p>
        </div>

        <button
          style={{
            background: "#2563EB",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Export Report
        </button>
      </div>

      {/* KPI Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {stats.map((item) => (
          <div
            key={item.title}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
            }}
          >
            <div style={{ fontSize: "28px" }}>{item.icon}</div>

            <h2
              style={{
                margin: "10px 0 5px",
                color: item.color,
              }}
            >
              {item.value}
            </h2>

            <p style={{ color: "#666" }}>{item.title}</p>
          </div>
        ))}
      </div>
            {/* Department Compliance & Health Score */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ color: "#2563EB", marginBottom: "20px" }}>
            Department Compliance
          </h2>

          {[
            { name: "Legal", value: 98, color: "#22C55E" },
            { name: "Procurement", value: 85, color: "#F59E0B" },
            { name: "Finance", value: 91, color: "#2563EB" },
            { name: "HR", value: 72, color: "#EF4444" },
          ].map((item) => (
            <div key={item.name} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span>{item.name}</span>
                <b>{item.value}%</b>
              </div>

              <div
                style={{
                  background: "#E5E7EB",
                  height: "10px",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    width: `${item.value}%`,
                    height: "10px",
                    background: item.color,
                    borderRadius: "20px",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#2563EB",
            color: "white",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <h2>Overall Health</h2>

          <h1
            style={{
              fontSize: "70px",
              margin: "20px 0",
              color: "#22C55E",
            }}
          >
            A-
          </h1>

          <p>✔ GDPR Compliant</p>
          <p>✔ SOC2 Certified</p>
          <p>✔ ISO 27001 Ready</p>
        </div>
      </div>
            {/* High Risk Contracts */}

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ color: "#2563EB", marginBottom: "20px" }}>
          High Risk Contracts
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr style={{ background: "#F3F4F6" }}>
              <th style={{ padding: "12px" }}>Contract ID</th>
              <th>Vendor</th>
              <th>Risk</th>
              <th>Status</th>
              <th>Review Date</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ padding: "12px" }}>CT-101</td>
              <td>ABC Pvt Ltd</td>
              <td style={{ color: "#EF4444" }}>High</td>
              <td>Pending</td>
              <td>20 Jul 2026</td>
            </tr>

            <tr>
              <td style={{ padding: "12px" }}>CT-145</td>
              <td>Infosys</td>
              <td style={{ color: "#F59E0B" }}>Medium</td>
              <td>In Review</td>
              <td>28 Jul 2026</td>
            </tr>

            <tr>
              <td style={{ padding: "12px" }}>CT-189</td>
              <td>TCS</td>
              <td style={{ color: "#22C55E" }}>Low</td>
              <td>Compliant</td>
              <td>05 Aug 2026</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Recent Activities */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ color: "#2563EB" }}>Recent Activities</h2>

          <ul style={{ lineHeight: "2" }}>
            <li>✅ GDPR audit completed</li>
            <li>📄 New compliance policy added</li>
            <li>⚠️ HR contract requires review</li>
            <li>✔ ISO checklist updated</li>
          </ul>
        </div>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ color: "#2563EB" }}>Upcoming Reviews</h2>

          <ul style={{ lineHeight: "2" }}>
            <li>📅 ABC Pvt Ltd - 20 Jul</li>
            <li>📅 Infosys - 28 Jul</li>
            <li>📅 Microsoft - 02 Aug</li>
            <li>📅 Google - 08 Aug</li>
          </ul>
        </div>
      </div>

    </div>
  );
};

export default ComplianceDashboard;
