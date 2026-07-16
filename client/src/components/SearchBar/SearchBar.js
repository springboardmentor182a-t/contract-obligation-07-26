import {
  FiSearch,
  FiRotateCcw,
} from "react-icons/fi";

import "../../styles/searchbar.css";

function SearchBar({
  searchTerm,
  setSearchTerm,
  vendor,
  setVendor,
  contractType,
  setContractType,
  owner,
  setOwner,
  status,
  setStatus,
  resetFilters,
  contracts = [],
}) {
  return (
    <div className="filter-container">
      {/* Search */}
      <div className="search-input">
        <FiSearch />

        <input
          type="text"
          placeholder="Search contracts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Vendor */}
      <select
        value={vendor}
        onChange={(e) => setVendor(e.target.value)}
      >
        <option value="">Vendor</option>

        {[...new Set(
          contracts
            .map(c => c.company)
            .filter(Boolean)
        )].map(company => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </select>

      {/* Contract Type */}
      <select
        value={contractType}
        onChange={(e) => setContractType(e.target.value)}
      >
        <option value="">Contract Type</option>

        {[...new Set(
          contracts
            .map(c => c.category)
            .filter(Boolean)
        )].map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Owner */}
      <select
        value={owner}
        onChange={(e) => setOwner(e.target.value)}
      >
        <option value="">Owner</option>

        {[...new Set(
          contracts
            .map(c => c.owner)
            .filter(Boolean)
        )].map(owner => (
          <option key={owner} value={owner}>
            {owner}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">Status</option>
        {[...new Set(
          contracts
            .map(c => c.status)
            .filter(Boolean)
        )].map(status => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
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

export default SearchBar;