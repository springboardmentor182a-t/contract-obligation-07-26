import React, { useState } from "react";
import { API_BASE_URL } from "../../data/constants";

const API_URL = `${API_BASE_URL}/tasks`;

function EditTaskModal({ task, onClose, onTaskUpdated }) {
  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    contract_id: task.contract_id || 1,
    related_contract: task.related_contract || "",
    company: task.company || "",
    assigned_to: task.assigned_to || "",
    due_date: task.due_date || "",
    priority: task.priority || "Medium",
    status: task.status || "Pending",
    progress: task.progress || 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "contract_id" || name === "progress"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      alert("Task updated successfully!");

      onTaskUpdated();
    } catch (error) {
      console.error(error);
      alert("Failed to update task.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "650px",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <h2>Edit Task</h2>

        <form onSubmit={handleSubmit}>
          <div style={row}>
            <input
              style={input}
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Task Title"
              required
            />

            <input
              style={input}
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              placeholder="Assigned To"
            />
          </div>

          <textarea
            style={{
              ...input,
              height: "80px",
              resize: "none",
            }}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <div style={row}>
            <input
              style={input}
              name="related_contract"
              value={formData.related_contract}
              onChange={handleChange}
              placeholder="Related Contract"
            />

            <input
              style={input}
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company"
            />
          </div>

          <div style={row}>
            <input
              style={input}
              type="date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
            />

            <input
              style={input}
              type="number"
              min="0"
              max="100"
              name="progress"
              value={formData.progress}
              onChange={handleChange}
            />
          </div>

          <div style={row}>
            <select
              style={input}
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <select
              style={input}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
              marginTop: "25px",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={cancelBtn}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={saveBtn}
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const row = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
};

const input = {
  flex: 1,
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "14px",
};

const cancelBtn = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const saveBtn = {
  padding: "10px 18px",
  border: "none",
  borderRadius: "8px",
  background: "#5B2EFF",
  color: "#fff",
  cursor: "pointer",
};

export default EditTaskModal;