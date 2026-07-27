import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "../../styles/roleDistribution.css";

const COLORS = [
  "#4F46E5",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#8B5CF6",
];

function RoleDistribution({ users }) {
  const roleCounts = users.reduce((acc, user) => {
    const role = user.role || "Unknown";
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(roleCounts).map(([role, value]) => ({
    name: role,
    value,
  }));

  const totalUsers = users.length;

  return (
    <div className="role-distribution-card">
      <h3>Role Distribution</h3>

      {totalUsers > 0 ? (
        <div className="role-chart-container">

          <div className="chart-wrapper">
            <ResponsiveContainer width={220} height={220}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="chart-center">
              <h2>{totalUsers}</h2>
              <span>Total</span>
            </div>
          </div>

          <div className="role-legend">
            {data.map((item, index) => (
              <div className="legend-item" key={item.name}>
                <div className="legend-left">
                  <span
                    className="legend-color"
                    style={{
                      background: COLORS[index % COLORS.length],
                    }}
                  ></span>

                  <span>{item.name}</span>
                </div>

                <span>
                  {item.value} (
                  {Math.round(
                    (item.value / totalUsers) * 100
                  )}
                  %)
                </span>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default RoleDistribution;