import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000"
}/api/contracts/compliance`;

const ComplianceDashboard = () => {
  const [data, setData] = useState({
    stats: [],
    departments: [],
    riskContracts: [],
    activities: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplianceData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setData(response.data || {});
        setError("");
      } catch (err) {
        console.error("Failed to fetch compliance data:", err);
        setError("Unable to load compliance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplianceData();
  }, []);

  if (loading) {
    return (
      <div className="compliance-dashboard">
        <h2>Compliance Dashboard</h2>
        <p>Loading compliance data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="compliance-dashboard">
        <h2>Compliance Dashboard</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="compliance-dashboard">
      <h2>Compliance Dashboard</h2>

      {data.stats && data.stats.length > 0 && (
        <div className="compliance-stats">
          {data.stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <h3>{stat.label || stat.name}</h3>
              <p>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {data.departments && data.departments.length > 0 && (
        <section>
          <h3>Department Compliance</h3>
          {data.departments.map((department, index) => (
            <div key={index}>
              <span>
                {department.name || department.department}
              </span>
              <span>
                {department.value || department.score || 0}
              </span>
            </div>
          ))}
        </section>
      )}

      {data.riskContracts && data.riskContracts.length > 0 && (
        <section>
          <h3>Risk Contracts</h3>

          {data.riskContracts.map((contract, index) => (
            <div key={index}>
              <strong>
                {contract.name ||
                  contract.contract ||
                  contract.vendor ||
                  `Contract ${index + 1}`}
              </strong>

              <span>
                {contract.risk ||
                  contract.riskLevel ||
                  contract.score ||
                  ""}
              </span>
            </div>
          ))}
        </section>
      )}

      {data.activities && data.activities.length > 0 && (
        <section>
          <h3>Recent Activities</h3>

          {data.activities.map((activity, index) => (
            <div key={index}>
              {activity.description ||
                activity.action ||
                activity.name ||
                JSON.stringify(activity)}
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default ComplianceDashboard;