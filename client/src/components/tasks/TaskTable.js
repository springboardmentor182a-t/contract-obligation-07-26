import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../data/constants";
const API_URL = `${API_BASE_URL}/tasks`;

function TaskTable({
  searchText = "",
  activeTab = "All Tasks",
  filters = {},
  currentPage,
  tasksPerPage,
  onTotalPagesChange,
  onEdit,
}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      console.log("TaskTable API Response:", data);

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  let filteredTasks = [...tasks];

  if (searchText) {
  const search = searchText.toLowerCase();

  filteredTasks = filteredTasks.filter((task) =>
    task.title?.toLowerCase().includes(search) ||
    task.description?.toLowerCase().includes(search) ||
    task.assigned_to?.toLowerCase().includes(search) ||
    task.related_contract?.toLowerCase().includes(search) ||
    task.company?.toLowerCase().includes(search) ||
    task.priority?.toLowerCase().includes(search) ||
    task.status?.toLowerCase().includes(search)
  );
}

  if (filters.priority) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.priority?.trim().toLowerCase() ===
        filters.priority.trim().toLowerCase()
    );
  }

  if (filters.status) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.status?.trim().toLowerCase() ===
        filters.status.trim().toLowerCase()
    );
  }

  if (filters.assignee) {
    filteredTasks = filteredTasks.filter((task) =>
      task.assigned_to
        ?.toLowerCase()
        .includes(filters.assignee.toLowerCase())
    );
  }

  if (activeTab === "Completed") {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === "Completed"
    );
  }

  if (activeTab === "Overdue") {
    filteredTasks = filteredTasks.filter(
      (task) =>
        new Date(task.due_date) < new Date() &&
        task.status !== "Completed"
    );
  }
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage) || 1;

    if (onTotalPagesChange) {
      onTotalPagesChange(totalPages);
    }

    const startIndex = (currentPage - 1) * tasksPerPage;
    const paginatedTasks = filteredTasks.slice(
      startIndex,
      startIndex + tasksPerPage
    );
  if (loading) {
    return <h3>Loading...</h3>;
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#F9FAFB",
          }}
        >
          <tr>
            <th style={th}></th>
            <th style={th}>Task</th>
            <th style={th}>Related To</th>
            <th style={th}>Assignee</th>
            <th style={th}>Priority</th>
            <th style={th}>Status</th>
            <th style={th}>Due Date</th>
            <th style={th}>Progress</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>

        <tbody>
                      {filteredTasks.length === 0 ? (
            <tr>
              <td
              colSpan="9"
              style={{
                textAlign: "center",
                padding: "25px",
              }}
            >
              No Tasks Found
            </td>
            </tr>
          ) : (
            paginatedTasks.map((task) => (
          <tr key={task.id}>

            <td style={td}>
              <input type="checkbox" />
            </td>

            <td style={td}>
              <div style={{ fontWeight: "600" }}>
                {task.title}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#777",
                  marginTop: "4px",
                }}
              >
                {task.description}
              </div>
            </td>

            <td style={td}>
              <div style={{ fontWeight: "600" }}>
                {task.related_contract || "-"}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#777",
                }}
              >
                {task.company || "-"}
              </div>
            </td>

            <td style={td}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#5B2EFF",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "600",
                  }}
                >
                  {task.assigned_to?.charAt(0)}
                </div>

                <span>{task.assigned_to}</span>
              </div>
            </td>

            <td style={td}>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background:
                    task.priority === "High"
                      ? "#FEE2E2"
                      : task.priority === "Medium"
                      ? "#FEF3C7"
                      : "#DCFCE7",
                  color:
                    task.priority === "High"
                      ? "#DC2626"
                      : task.priority === "Medium"
                      ? "#D97706"
                      : "#15803D",
                  fontWeight: "600",
                }}
              >
                {task.priority}
              </span>
            </td>

            <td style={td}>
              <span
                style={{
                  padding: "6px 12px",
                  borderRadius: "20px",
                  background:
                    task.status === "Completed"
                      ? "#DCFCE7"
                      : task.status === "Pending"
                      ? "#FEF3C7"
                      : task.status === "In Progress"
                      ? "#DBEAFE"
                      : "#FEE2E2",

                  color:
                    task.status === "Completed"
                      ? "#15803D"
                      : task.status === "Pending"
                      ? "#D97706"
                      : task.status === "In Progress"
                      ? "#2563EB"
                      : "#DC2626",
                  fontWeight: "600",
                }}
              >
                {task.status}
              </span>
            </td>

            <td style={td}>
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : "-"}
            </td>

            <td style={td}>
              <div
                style={{
                  width: "100px",
                  background: "#E5E7EB",
                  height: "8px",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${task.progress || 0}%`,
                    height: "100%",
                    background:
                      task.progress >= 80
                        ? "#22C55E"
                        : task.progress >= 40
                        ? "#F59E0B"
                        : "#EF4444",
                  }}
                ></div>
              </div>

              <div
                style={{
                  fontSize: "12px",
                  marginTop: "5px",
                }}
              >
                {task.progress || 0}%
              </div>
            </td>

            <td style={td}>
              <button
                onClick={() => onEdit && onEdit(task)}
                style={{
                  marginRight: "10px",
                  border: "none",
                  background: "#5B2EFF",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  border: "none",
                  background: "#EF4444",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </td>

          </tr>
        ))
          )}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "14px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

const td = {
  padding: "14px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

export default TaskTable;