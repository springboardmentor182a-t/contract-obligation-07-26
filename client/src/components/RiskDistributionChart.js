import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function RiskDistributionChart({ renewals }) {
  const active = renewals.filter(
    (r) => r.status === "Active"
  ).length;

  const pending = renewals.filter(
    (r) => r.status === "Pending"
  ).length;

  const expired = renewals.filter(
    (r) => r.status === "Expired"
  ).length;

  const data = {
    labels: [
      "Active",
      "Pending",
      "Expired",
    ],

    datasets: [
      {
        data: [
          active,
          pending,
          expired,
        ],

        backgroundColor: [
          "#22C55E",
          "#F59E0B",
          "#EF4444",
        ],

        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          boxWidth: 12,
          padding: 12,

          font: {
            size: 11,
          },

          color: "#666",
        },
      },
    },

    cutout: "68%",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "250px",
      }}
    >
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
}

export default RiskDistributionChart;