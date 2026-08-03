import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
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
    "Dec"
  ];

  const monthCounts = new Array(12).fill(0);

  renewals.forEach((renewal) => {
    const date = new Date(renewal.renewal_date);
    const month = date.getMonth();
    monthCounts[month]++;
  });

  const data = {
    labels: months,

    datasets: [
      {
        label: "Renewals",
        data: monthCounts,
        backgroundColor: "#6C4CFF",
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 35
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        grid: {
          display: false
        }
      },

      y: {
        beginAtZero: true,

        ticks: {
          stepSize: 1
        },

        grid: {
          color: "#EEEEEE"
        }
      }
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
          marginBottom: 20
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>
            Contract Activity
          </h3>

          <p
            style={{
              color: "#777",
              fontSize: 13,
              marginTop: 6
            }}
          >
            Monthly renewal overview
          </p>
        </div>
      </div>

      <Bar data={data} options={options} />
    </div>
  );
}

export default ContractActivityChart;