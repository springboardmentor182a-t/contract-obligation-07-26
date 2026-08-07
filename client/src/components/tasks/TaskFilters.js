import React, { useState } from "react";

function TaskFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    assignee: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const inputStyle = {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minWidth: "180px",
    fontSize: "14px",
    background: "#fff",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}
    >
      <select
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">All Priority</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>

      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        style={inputStyle}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <input
        type="text"
        name="assignee"
        placeholder="Assignee"
        value={filters.assignee}
        onChange={handleChange}
        style={{ ...inputStyle, minWidth: "220px" }}
      />
    </div>
  );
}

export default TaskFilters;