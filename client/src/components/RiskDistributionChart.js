import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function RiskDistributionChart({ renewals }) {

  // Count renewals based on status
  const lowRisk = renewals.filter(
    (r) => r.status === "Completed"
  ).length;

  const mediumRisk = renewals.filter(
    (r) => r.status === "Pending"
  ).length;

  const highRisk = renewals.filter(
    (r) => r.status === "Overdue"
  ).length;

  const data = {
    labels: [
      "Completed",
      "Pending",
      "Overdue"
    ],

    datasets: [
      {
        data: [
          lowRisk,
          mediumRisk,
          highRisk
        ],

        backgroundColor: [
          "#22C55E",
          "#F59E0B",
          "#EF4444"
        ],

        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 12
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          boxWidth: 14,
          padding: 20,
          font: {
            size: 13
          }
        }
      }
    },

    cutout: "70%"
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
      <h3
        style={{
          marginTop: 0,
          marginBottom: 5
        }}
      >
        Risk Distribution
      </h3>

      <p
        style={{
          color: "#777",
          fontSize: 13,
          marginBottom: 20
        }}
      >
        Contract risk analysis
      </p>

      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
}

export default RiskDistributionChart;