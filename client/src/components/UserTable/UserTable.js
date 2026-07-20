import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";

import "../../styles/userTable.css";

function UserTable({
  users,
  setSelectedUser,
  onEdit,
  onDelete,
}) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Department</th>
            <th>Email</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="company">
                    <div className="company-logo">
                      {(user.name || "?").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                </td>

                <td>{user.role}</td>

                <td>{user.department}</td>

                <td>{user.email}</td>

                <td>
                  <span
                    className={`status ${user.status?.toLowerCase()}`}
                  >
                    {user.status}
                  </span>
                </td>

                <td>
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <div className="actions">
                    <FiEye
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedUser(user)}
                    />

                    <FiEdit
                      style={{ cursor: "pointer" }}
                      onClick={() => onEdit && onEdit(user)}
                    />

                    <FiTrash2
                      style={{ cursor: "pointer" }}
                      onClick={() => onDelete && onDelete(user)}
                    />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  padding: "30px",
                  color: "#888",
                }}
              >
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;