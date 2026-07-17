const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const contracts = [
  {
    id: "CNT001",
    title: "Software Development Agreement",
    client: "ABC Pvt Ltd",
    status: "Active",
    startDate: "01-07-2026",
    endDate: "30-06-2027"
  },
  {
    id: "CNT002",
    title: "Cloud Service Agreement",
    client: "XYZ Technologies",
    status: "Pending",
    startDate: "15-07-2026",
    endDate: "14-07-2027"
  },
  {
    id: "CNT003",
    title: "Maintenance Contract",
    client: "Global Solutions",
    status: "Completed",
    startDate: "10-01-2026",
    endDate: "09-07-2026"
  }
];

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/api/contracts", (req, res) => {
  res.json(contracts);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});