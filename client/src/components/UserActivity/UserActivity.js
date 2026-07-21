import React from "react";
import "../../styles/userActivity.css";

function UserActivity({ users }) {
  const recentUsers = [...users]
    .sort((a, b) => {
      if (!a.last_login) return 1;
      if (!b.last_login) return -1;
      return new Date(b.last_login) - new Date(a.last_login);
    })
    .slice(0, 5);

  return (
    <div className="user-activity-card">
      <h3>Recent User Activity</h3>

      {recentUsers.length > 0 ? (
        <div className="activity-list">
          {recentUsers.map((user) => (
            <div className="activity-item" key={user.id}>
              <div className="activity-avatar">
                {(user.name || "?").charAt(0).toUpperCase()}
              </div>

              <div className="activity-info">
                <h4>{user.name}</h4>

                <p>{user.role}</p>
              </div>

              <div className="activity-time">
                {user.last_login
                  ? new Date(user.last_login).toLocaleDateString()
                  : "Never"}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No recent activity.</p>
      )}
    </div>
  );
}

export default UserActivity;