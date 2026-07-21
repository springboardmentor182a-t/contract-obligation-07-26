import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getUsers,
  deleteUser,
} from "../services/userServices";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import UserCards from "../components/UserCards/UserCards";
import UserTable from "../components/UserTable/UserTable";
import UserDetails from "../components/UserDetails/UserDetails";
import RoleDistribution from "../components/RoleDistribution/RoleDistribution";
import UserActivity from "../components/UserActivity/UserActivity";
import UserSearchBar from "../components/UserSearchBar/UserSearchBar";

import "../styles/userManagement.css";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
  searchTerm: "",
  role: "",
  department: "",
  status: "",
  sortBy: "",
});

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
  try {
    const data = await getUsers();
    setUsers(data);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

useEffect(() => {
  fetchUsers();
}, []);

  const handleEdit = (user) => {
    console.log("Edit User:", user);
  };

  const handleDelete = async (user) => {
    const confirmDelete = window.confirm(
        `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmDelete) return;

    try {
        await deleteUser(user.id);

        alert("User deleted successfully!");

        if (selectedUser?.id === user.id) {
        setSelectedUser(null);
        }

        fetchUsers();
    } catch (error) {
        console.error(error);
        alert("Failed to delete user.");
    }
    };
  const resetFilters = () => {
    setSearchTerm("");
    setRole("");
    setDepartment("");
    setStatus("");
    setSortBy("");

    setAppliedFilters({
      searchTerm: "",
      role: "",
      department: "",
      status: "",
      sortBy: "",
    });
  };
  const applyFilters = () => {
  setAppliedFilters({
    searchTerm,
    role,
    department,
    status,
    sortBy,
  });
};
const exportUsers = () => {
  if (users.length === 0) {
    alert("No users to export.");
    return;
  }


  const headers = [
    "Name",
    "Email",
    "Role",
    "Department",
    "Status",
  ];

  const rows = users.map(user => [
    user.name,
    user.email,
    user.role,
    user.department,
    user.status,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "users.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
};

    let filteredUsers = users.filter((user) => {
  const matchesSearch =
  (user.name || "")
    .toLowerCase()
    .includes(appliedFilters.searchTerm.toLowerCase()) ||
  (user.email || "")
    .toLowerCase()
    .includes(appliedFilters.searchTerm.toLowerCase());

  const matchesRole =
    appliedFilters.role === "" ||
    user.role === appliedFilters.role;

  const matchesDepartment =
    appliedFilters.department === "" ||
    user.department === appliedFilters.department;

  const matchesStatus =
    appliedFilters.status === "" ||
    user.status === appliedFilters.status;
  return (
    matchesSearch &&
    matchesRole &&
    matchesDepartment &&
    matchesStatus
  );
});
switch (appliedFilters.sortBy) {
  case "name":
    filteredUsers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    break;

  case "role":
    filteredUsers.sort((a, b) =>
      a.role.localeCompare(b.role)
    );
    break;

  case "department":
    filteredUsers.sort((a, b) =>
      a.department.localeCompare(b.department)
    );
    break;

  case "lastLogin":
    filteredUsers.sort(
      (a, b) =>
        new Date(b.last_login) -
        new Date(a.last_login)
    );
    break;

  default:
    break;
}

  return (
    <div className="user-management">
      <Sidebar />

      <div className="main-content">
        <Header />

        <div className="user-management-body">
          {/* Page Heading */}
          <div className="page-heading">
            <h1>User Management</h1>

            <p>
              Manage users, roles, permissions and account activity.
            </p>
          </div>

          {/* Statistics Cards */}
          <UserCards users={users} />

          {/* Top Buttons */}
          <div className="user-top">
            <div className="user-title">
              <h2>Users ({filteredUsers.length})</h2>
            </div>

            <div className="top-buttons">
                <button
                    className="export-btn"
                    onClick={exportUsers}
                >
                    Export
                </button>

              <button
                className="new-user-btn"
                onClick={() => navigate("/add-user")}
              >
                + Add User
              </button>
            </div>
          </div>

          <div className="filter-wrapper">
            <UserSearchBar
              users={users}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              role={role}
              setRole={setRole}
              department={department}
              setDepartment={setDepartment}
              status={status}
              setStatus={setStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="user-content">
            <div className="left-section">
              <UserTable
                users={filteredUsers}
                setSelectedUser={setSelectedUser}
                onEdit={handleEdit}
                onDelete={handleDelete}
                />
            </div>

            <div className="right-section">
              <UserDetails
                selectedUser={selectedUser}
              />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bottom-section">
            <RoleDistribution users={users} />

            <UserActivity users={users} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagement;