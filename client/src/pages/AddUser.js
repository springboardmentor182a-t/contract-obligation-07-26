import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/addUser.css";

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
    <div className="add-user-layout">
      <Sidebar />

      <div className="add-user-main">
        <Header />

        <div className="add-user-container">
          <div className="add-user-card">
            <h1>Add User</h1>
            <p>Create a new user account.</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  placeholder="Enter role"
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                  placeholder="Enter department"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={user.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUser;