import React, { useEffect, useState } from "react";
import { updateUser } from "../../services/userAPI";

function EditUserModal({
  open,
  onClose,
  selectedUser,
  users,
  setUsers,
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        full_name: selectedUser.full_name,
        email: selectedUser.email,
        role: selectedUser.role,
        department: selectedUser.department,
        status: selectedUser.status,
      });
    }
  }, [selectedUser]);

  if (!open || !selectedUser) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUser(selectedUser.id, formData);

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? updatedUser : user
      );

      setUsers(updatedUsers);
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="invite-modal">

        <h2>Edit User</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            required
          />

          <input
            name="department"
            placeholder="Department"
            value={formData.department}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <div className="modal-actions">
            <button type="submit">Save</button>

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default EditUserModal;