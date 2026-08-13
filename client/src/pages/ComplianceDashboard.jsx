<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
>>>>>>> origin/main-group-B

const API_URL = `${process.env.REACT_APP_API_BASE_URL}/api/contracts/compliance`;
const ComplianceDashboard = () => {
<<<<<<< HEAD
  const [data, setData] = useState({
  stats: [],
  departments: [],
  riskContracts: [],
  activities: [],
  reviews: [],
}); 
  useEffect(() => {
  async function loadData() {
    try {
      const res = await fetch(API_URL);
      console.log("Status:", res.status);

      const result = await res.json();
      console.log("Response:", result);

      setData(result);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  }

  loadData();
  }, []);
  
const stats = data.stats;
const departments = data.departments;
const riskContracts = data.riskContracts;
const activities = data.activities;
const reviews = data.reviews;
=======
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    axios.get('/api/compliance/dashboard')
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error loading compliance data: {error}</div>;
  }

  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">No compliance data found. Click 'Load Demo Data' in Settings to populate.</div>;
  }

>>>>>>> origin/main-group-B
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

          {departments.map((item) => (
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
          {riskContracts.map((contract) => (
            <tr key={contract.id}>
              <td style={{ padding: "12px" }}>{contract.id}</td>
              <td>{contract.vendor}</td>
              <td>{contract.risk}</td>
              <td>{contract.status}</td>
              <td>{contract.reviewDate}</td>
            </tr>
          ))}
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
          {activities.map((activity, index) => (
            <li key={index}>{activity}</li>
          ))}
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
          {reviews.map((review, index) => (
            <li key={index}>{review}</li>
          ))}
        </ul>  
        </div>
      </div>

    </div>
  );
};

export default ComplianceDashboard;
