import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../data/constants";
const API_URL = `${API_BASE_URL}/tasks`;

function NewTaskModal({
  onClose,
  onTaskAdded,
  editTask,
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contract_id: 1,
    related_contract: "",
    company: "",
    assigned_to: "",
    due_date: "",
    priority: "Medium",
    status: "Pending",
    progress: 0,
  });
  useEffect(() => {
    if (editTask) {
        setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        contract_id: editTask.contract_id || 1,
        related_contract: editTask.related_contract || "",
        company: editTask.company || "",
        assigned_to: editTask.assigned_to || "",
        due_date: editTask.due_date
            ? editTask.due_date.substring(0, 10)
            : "",
        priority: editTask.priority || "Medium",
        status: editTask.status || "Pending",
        progress: editTask.progress || 0,
        });
    } else {
        setFormData({
        title: "",
        description: "",
        contract_id: 1,
        related_contract: "",
        company: "",
        assigned_to: "",
        due_date: "",
        priority: "Medium",
        status: "Pending",
        progress: 0,
        });
    }
    }, [editTask]);

  // 👇 handleChange starts after useEffect
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
      const response = await fetch(
        editTask
            ? `${API_URL}/${editTask.id}`
            : API_URL,
        {
            method: editTask ? "PUT" : "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }
        );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert(
        editTask
            ? "Task updated successfully!"
            : "Task created successfully!"
        );

      if (onTaskAdded) {
        onTaskAdded();
      }

      onClose();
    } catch (error) {
        console.error(error);
        alert(error.message);
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
        <h2>
            {editTask ? "Edit Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={row}>
            <input
              style={input}
              name="title"
              placeholder="Task Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              style={input}
              name="assigned_to"
              placeholder="Assigned To"
              value={formData.assigned_to}
              onChange={handleChange}
            />
          </div>

          <textarea
            style={{
              ...input,
              height: "80px",
              resize: "none",
            }}
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <div style={row}>
            <input
              style={input}
              name="related_contract"
              placeholder="Related Contract"
              value={formData.related_contract}
              onChange={handleChange}
            />

            <input
              style={input}
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
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
              name="progress"
              min="0"
              max="100"
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
              {editTask ? "Update Task" : "Save Task"}
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

export default NewTaskModal;