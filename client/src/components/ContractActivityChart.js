import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function ContractActivityChart({ renewals }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthCounts = new Array(12).fill(0);

  renewals.forEach((renewal) => {
    const date = new Date(renewal.renewal_date);

    if (!isNaN(date.getTime())) {
      const month = date.getMonth();
      monthCounts[month]++;
    }
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: "Renewals",
        data: monthCounts,
        backgroundColor: "#6C4CFF",
        borderRadius: 6,
        borderSkipped: false,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          font: {
            size: 11,
          },
          color: "#666",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          stepSize: 1,
          font: {
            size: 11,
          },
          color: "#666",
        },

        grid: {
          color: "#EEEEEE",
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "250px",
      }}
    >
      <Bar data={data} options={options} />
    </div>
  );
}

export default ContractActivityChart;