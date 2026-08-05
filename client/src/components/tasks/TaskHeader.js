import React from "react";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Plus,
} from "lucide-react";

function TaskHeader({ onNewTask }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      {/* Left Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        <button
          style={{
            border: "none",
            background: "#fff",
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Menu size={22} />
        </button>

        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "700",
            }}
          >
            Tasks
          </h2>

          <div
            style={{
              marginTop: "5px",
              color: "#6B7280",
              fontSize: "14px",
            }}
          >
            Home / Tasks
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "18px",
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "380px",
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "0 14px",
            height: "46px",
          }}
        >
          <Search size={18} color="#6B7280" />

          <input
            type="text"
            placeholder="Search tasks, contracts, assignees..."
            style={{
              border: "none",
              outline: "none",
              marginLeft: "10px",
              width: "100%",
              fontSize: "14px",
              background: "transparent",
            }}
          />
        </div>

        {/* Notification */}
        <button
          style={{
            position: "relative",
            border: "none",
            background: "#fff",
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <Bell size={20} />

          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "18px",
              height: "18px",
              background: "#6D28D9",
              color: "#fff",
              borderRadius: "50%",
              fontSize: "11px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            8
          </span>
        </button>

        {/* User */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="User"
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "50%",
            }}
          />

          <div>
            <div
              style={{
                fontWeight: "600",
                fontSize: "15px",
              }}
            >
              Sarah Johnson
            </div>

            <div
              style={{
                color: "#6B7280",
                fontSize: "13px",
              }}
            >
              Legal Manager
            </div>
          </div>

          <ChevronDown size={18} />
        </div>

        {/* New Task */}
        <button
          onClick={onNewTask}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#5B2EFF",
            color: "#fff",
            border: "none",
            padding: "12px 22px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          <Plus size={18} />
          New Task
        </button>
      </div>
    </div>
  );
}

export default TaskHeader;