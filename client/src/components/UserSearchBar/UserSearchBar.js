import { FiSearch, FiRotateCcw } from "react-icons/fi";

import "../../styles/Searchbar.css";

function UserSearchBar({
  users = [],
  searchTerm,
  setSearchTerm,
  role,
  setRole,
  department,
  setDepartment,
  status,
  setStatus,
  resetFilters,
}) {
  return (
    <div className="filter-container">

      {/* Search */}
      <div className="search-input">
        <FiSearch />

        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Role */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Role</option>

        {[...new Set(users.map((u) => u.role).filter(Boolean))].map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      {/* Department */}
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="">Department</option>

        {[...new Set(users.map((u) => u.department).filter(Boolean))].map(
          (department) => (
            <option key={department} value={department}>
              {department}
            </option>
          )
        )}
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>

        {[...new Set(users.map((u) => u.status).filter(Boolean))].map(
          (status) => (
            <option key={status} value={status}>
              {status}
            </option>
          )
        )}
      </select>

      {/* Reset */}
      <button
        className="reset-btn"
        onClick={resetFilters}
      >
        <FiRotateCcw />
        Reset
      </button>
    </div>
  );
}

export default UserSearchBar;