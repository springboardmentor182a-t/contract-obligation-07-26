import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import { createUser } from "../services/userServices";

function AddUser() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await createUser(user);

    alert("User added successfully!");

    navigate("/users");
  } catch (error) {
    console.error(error);
    alert("Failed to add user.");
  }
};

  return (
    <div className="user-management">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div style={{ padding: "30px" }}>
          <h1>Add User</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={user.name}
              onChange={handleChange}
              required
            />

            <br /><br />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
              required
            />

            <br /><br />

            <input
              type="text"
              name="role"
              placeholder="Role"
              value={user.role}
              onChange={handleChange}
              required
            />

            <br /><br />

            <input
              type="text"
              name="department"
              placeholder="Department"
              value={user.department}
              onChange={handleChange}
              required
            />

            <br /><br />

            <select
              name="status"
              value={user.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>

            <br /><br />

            <button type="submit">
              Save User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddUser;