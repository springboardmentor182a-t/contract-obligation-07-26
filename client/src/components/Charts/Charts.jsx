import "./Charts.css";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

//const Charts = () => {
  const Charts = ({ renewals }) => {

  /*const donutData = {
    labels: ["Automatic", "Manual"],
    datasets: [
      {
        data: [148, 99],
        backgroundColor: ["#6C63FF", "#9B8CFF"],
        borderWidth: 0,
      },
    ],
  };*/
  const automaticCount = renewals.filter(
  item => item.renewal_type === "Automatic"
).length;

const manualCount = renewals.filter(
  item => item.renewal_type === "Manual"
).length;

const donutData = {
  labels: ["Automatic", "Manual"],
  datasets: [
    {
      data: [automaticCount, manualCount],
      backgroundColor: ["#6C63FF", "#9B8CFF"],
      borderWidth: 0,
    },
  ],
};


  /*const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Renewals",
        data: [25, 38, 29, 42, 34, 48],
        backgroundColor: "#6C63FF",
        borderRadius: 8,
      },
    ],
  };*/
  const monthCounts = {};

renewals.forEach(item => {
  const month = new Date(item.renewal_date).toLocaleString("default", {
    month: "short",
  });

  monthCounts[month] = (monthCounts[month] || 0) + 1;
});

const barData = {
  labels: Object.keys(monthCounts),
  datasets: [
    {
      label: "Renewals",
      data: Object.values(monthCounts),
      backgroundColor: "#6C63FF",
      borderRadius: 8,
    },
  ],
};

  /*const lineData = {
    labels: ["Week1", "Week2", "Week3", "Week4"],
    datasets: [
      {
        label: "Completion %",
        data: [65, 72, 84, 91],
        borderColor: "#00C48C",
        backgroundColor: "#00C48C",
        tension: 0.4,
      },
    ],
  };*/
  const pending = renewals.filter(
  item => item.status === "Pending"
).length;

const completed = renewals.filter(
  item => item.status === "Completed"
).length;

const overdue = renewals.filter(item =>
  new Date(item.renewal_date) < new Date()
).length;

const lineData = {
  labels: ["Pending", "Completed", "Overdue"],
  datasets: [
    {
      label: "Renewals",
      data: [pending, completed, overdue],
      borderColor: "#00C48C",
      backgroundColor: "#00C48C",
      tension: 0.4,
    },
  ],
};

  
    return (
  <div className="charts-container">

    <div className="chart-card">
      <h3>Renewal Types</h3>

      <div className="chart-wrapper">
        <Doughnut
          data={donutData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "60%",
            plugins: {
              legend: {
                position: "top",
              },
            },
          }}
        />
      </div>
    </div>

    <div className="chart-card">
      <h3>Monthly Renewals</h3>

      <div className="chart-wrapper">
        <Bar
          data={barData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>

    <div className="chart-card">
      <h3>Renewal Progress</h3>

      <div className="chart-wrapper">
        <Line
          data={lineData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>

  </div>
);
  
};

export default Charts;