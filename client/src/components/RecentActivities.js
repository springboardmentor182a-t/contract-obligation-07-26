import React from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaEdit
} from "react-icons/fa";

function RecentActivities() {
  const renewals = [
    
  ];

  const statusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#22C55E";
      case "Pending":
        return "#F59E0B";
      case "Expired":
        return "#EF4444";
      default:
        return "#3B82F6";
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "0 4px 12px rgba(0,0,0,.08)"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>Recent Renewals</h3>
          <p
            style={{
              margin: "5px 0 0",
              color: "#777",
              fontSize: 13
            }}
          >
            Latest contract renewal activities
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10
          }}
        >
          <button style={buttonStyle}>
            <FaFilter /> Filter
          </button>

          <button style={buttonStyle}>
            <FaDownload /> Export
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#f5f5f5",
          padding: "10px 15px",
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <FaSearch color="#888" />

        <input
          placeholder="Search contracts..."
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            marginLeft: 10,
            width: "100%"
          }}
        />
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr
            style={{
              background: "#f5f5f5"
            }}
          >
            <th style={th}>Contract</th>
            <th style={th}>Client</th>
            <th style={th}>Renewal</th>
            <th style={th}>Type</th>
            <th style={th}>Status</th>
            <th style={th}>Action</th>
          </tr>
        </thead>

        <tbody>
          {renewals.map((item, index) => (
            <tr key={index}>
              <td style={td}>{item.contract}</td>
              <td style={td}>{item.client}</td>
              <td style={td}>{item.renewal}</td>
              <td style={td}>{item.type}</td>

              <td style={td}>
                <span
                  style={{
                    background: statusColor(item.status),
                    color: "#fff",
                    padding: "6px 12px",
                    borderRadius: 20,
                    fontSize: 12
                  }}
                >
                  {item.status}
                </span>
              </td>

              <td style={td}>
                <FaEye
                  style={{
                    marginRight: 15,
                    cursor: "pointer",
                    color: "#5B2EFF"
                  }}
                />

                <FaEdit
                  style={{
                    cursor: "pointer",
                    color: "#F59E0B"
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: 12,
  fontWeight: "bold"
};

const td = {
  padding: 14,
  borderBottom: "1px solid #eee"
};

const buttonStyle = {
  border: "none",
  background: "#5B2EFF",
  color: "#fff",
  padding: "10px 15px",
  borderRadius: 8,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8
};

export default RecentActivities;