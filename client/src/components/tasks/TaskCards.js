import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../data/constants";
import {
  ClipboardList,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";

const API_URL = `${API_BASE_URL}/tasks`;

function TaskCards({ refreshKey }) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchTaskStats();
  }, [refreshKey]);

  const fetchTaskStats = async () => {
    try {
      const response = await fetch(API_URL);
      const tasks = await response.json();

      const today = new Date();

      const completed = tasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
      ).length;

      const inProgress = tasks.filter((task) => {
        const status = task.status?.toLowerCase();
        return status === "pending" || status === "in progress";
      }).length;

      const overdue = tasks.filter((task) => {
        if (!task.due_date) return false;

        return (
          new Date(task.due_date) < today &&
          task.status?.toLowerCase() !== "completed"
        );
      }).length;

      setStats({
        total: tasks.length,
        completed,
        inProgress,
        overdue,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const cards = [
    {
      title: "Total Tasks",
      value: stats.total,
      subtitle: "All assigned tasks",
      color: "#5B2EFF",
      icon: <ClipboardList size={26} color="#fff" />,
    },
    {
      title: "Completed",
      value: stats.completed,
      subtitle: "Completed tasks",
      color: "#22C55E",
      icon: <CheckCircle2 size={26} color="#fff" />,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      subtitle: "Tasks in progress",
      color: "#F59E0B",
      icon: <Clock3 size={26} color="#fff" />,
    },
    {
      title: "Overdue",
      value: stats.overdue,
      subtitle: "Overdue tasks",
      color: "#EF4444",
      icon: <AlertCircle size={26} color="#fff" />,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "24px",
        marginBottom: "30px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: "18px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "16px",
              background: card.color,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {card.icon}
          </div>

          <div>
            <div
              style={{
                color: "#374151",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: "34px",
                fontWeight: "700",
                margin: "6px 0",
              }}
            >
              {card.value}
            </div>

            <div
              style={{
                color: "#6B7280",
                fontSize: "14px",
              }}
            >
              {card.subtitle}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskCards;