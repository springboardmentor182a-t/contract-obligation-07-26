import React from "react";
import "../../styles/userDetails.css";

function UserDetails({ selectedUser }) {
  if (!selectedUser) {
    return (
      <div className="user-details-card">
        <h3>User Details</h3>

        <div className="empty-user">
          Select a user to view details.
        </div>
      </div>
    );
  }

  return (
    <div className="user-details-card">

      <h3>User Details</h3>

      <div className="user-profile">

        <div className="user-avatar">
          {selectedUser.name?.charAt(0).toUpperCase()}
        </div>

        <h2>{selectedUser.name}</h2>

        <p>{selectedUser.email}</p>

      </div>

      <div className="detail-row">
        <span>Phone</span>
        <strong>{selectedUser.phone}</strong>
      </div>

      <div className="detail-row">
        <span>Department</span>
        <strong>{selectedUser.department}</strong>
      </div>

      <div className="detail-row">
        <span>Role</span>
        <strong>{selectedUser.role}</strong>
      </div>

      <div className="detail-row">
        <span>Status</span>
        <strong>{selectedUser.status}</strong>
      </div>

      <div className="detail-row">
        <span>Active</span>
        <strong>
          {selectedUser.is_active ? "Yes" : "No"}
        </strong>
      </div>

      <div className="detail-row">
        <span>Date Joined</span>
        <strong>{selectedUser.date_joined}</strong>
      </div>

      <div className="detail-row">
        <span>Last Login</span>
        <strong>
          {selectedUser.last_login
            ? new Date(selectedUser.last_login).toLocaleString()
            : "-"}
        </strong>
      </div>

    </div>
  );
}

export default UserDetails;