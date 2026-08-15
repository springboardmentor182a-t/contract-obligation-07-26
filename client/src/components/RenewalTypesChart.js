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

function RenewalTypesChart({ renewals }) {
  const automatic = renewals.filter(
    (r) => r.renewal_type === "Automatic"
  ).length;

  const manual = renewals.filter(
    (r) => r.renewal_type === "Manual"
  ).length;

  const data = {
    labels: ["Automatic", "Manual"],
    datasets: [
      {
        data: [automatic, manual],
        backgroundColor: [
          "#4F32E8",
          "#8B6FEF",
        ],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 13,
          },
          padding: 8,
          boxWidth: 30,
        },
      },

      tooltip: {
        enabled: true,
      },
    },

    cutout: "60%",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "220px",
      }}
    >
      <Doughnut
        data={data}
        options={options}
      />
    </div>
  );
}

export default RenewalTypesChart;