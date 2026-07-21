import { FiSearch, FiRotateCcw, FiFilter } from "react-icons/fi";
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
  sortBy,
  setSortBy,
  applyFilters,
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
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="role">Role</option>
        <option value="department">Department</option>
        <option value="lastLogin">Last Login</option>
      </select>
      <button
        className="apply-btn"
        onClick={applyFilters}
      >
        <FiFilter />
        Apply Filters
      </button>

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