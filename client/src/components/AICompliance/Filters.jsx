import { Search } from "lucide-react";

export default function Filters({
  searchTerm,
  setSearchTerm,
  riskFilter,
  setRiskFilter,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="section-card ai-filter-card">

      <div className="section-header">
        <h3 className="section-heading">
          Filter Compliance Records
        </h3>
      </div>

      <div className="ai-filter-row">

        <div className="ai-search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search contract or vendor..."
            value={searchTerm}
            onChange={(e) =>
                setSearchTerm(e.target.value)
            }
          />
        </div>

        <select
            className="ai-filter-select"
            value={riskFilter}
            onChange={(e) =>
                setRiskFilter(e.target.value)
            }
            >
            <option value="All">All Risk Levels</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
        </select>

        <select
            className="ai-filter-select"
            value={statusFilter}
            onChange={(e) =>
                setStatusFilter(e.target.value)
            }
        >
          <option value="All">All Status</option>
          <option value="Compliant">Compliant</option>
          <option value="Attention Required">Attention Required</option>
        </select>

      </div>

    </div>
  );
}