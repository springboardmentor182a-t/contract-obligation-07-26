import React, { useState } from "react";
import { getUsers, inviteUser } from "../../services/userAPI";

function InviteUserModal({open,onClose,users,setUsers,}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async () => {
  if (
    !formData.name ||
    !formData.email ||
    !formData.role ||
    !formData.department
  ) {
    alert("Please fill all fields.");
    return;
  }

  try {
    // Send data to backend
    await inviteUser({
      full_name: formData.name,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      message: `Invitation sent to ${formData.name}`,
    });

    // Refresh users from backend
    const refreshedUsers = await getUsers();
    setUsers(refreshedUsers);

    // Clear form
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "",
    });

    onClose();
  } catch (error) {
  console.error("Error:", error);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
    alert(JSON.stringify(error.response.data));
  } else {
    alert(error.message);
  }
}
};

  return (
    <div className="modal-overlay">
      <div className="invite-modal">

        <h2>Invite User</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option>Administrator</option>
          <option>Legal Manager</option>
          <option>Compliance Officer</option>
          <option>Employee</option>
        </select>

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
        />

        <div className="modal-buttons">
          <button onClick={onClose}>Cancel</button>

          <button
            className="invite-btn"
            onClick={handleSubmit}
          >
            Invite
          </button>
        </div>

      </div>
    </div>
  );
}

export default InviteUserModal;
