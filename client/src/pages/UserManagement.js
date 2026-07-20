import React, { useState, useEffect } from "react";
import UserSummaryCards from "../components/UserManagement/UserSummaryCards";
import SearchBar from "../components/UserManagement/SearchBar";
import InviteUserButton from "../components/UserManagement/InviteUserButton";
import UserTable from "../components/UserManagement/UserTable";
import InviteUserModal from "../components/UserManagement/InviteUserModal";
import "../styles/user-management.css";
import EditUserModal from "../components/UserManagement/EditUserModal";
import { getUsers, deleteUser } from "../services/userAPI";
function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  try {
    await deleteUser(id);

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== id)
    );
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete user.");
  }
};

  return (
    <div className="user-management-page">

      <div className="user-management-hero">
        <div className="user-management-header">
          <div>
            <p className="hero-label">USER ADMINISTRATION</p>

            <h1>User Management</h1>

            <p className="hero-description">
              Manage users, roles, permissions and department access across the
              ContractIQ platform.
            </p>
          </div>

          <InviteUserButton onClick={() => setIsModalOpen(true)} />

          <InviteUserModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            users={users}
            setUsers={setUsers}
          />
        </div>
      </div>

      <UserSummaryCards users={users} />

      <div className="user-management-search">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <UserTable
        users={users}
        searchTerm={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* EditUserModal will be added here next */}
      <EditUserModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedUser={selectedUser}
        users={users}
        setUsers={setUsers}
      />

    </div>
  );
}

export default UserManagement;