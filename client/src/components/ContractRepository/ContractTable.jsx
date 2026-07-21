import React from "react";
import {
    Eye,
    Pencil,
    Trash2,
    MoreHorizontal,
} from "lucide-react";

const contracts = [
    {
        id: "CTR-001",
        title: "Cloud Infrastructure Agreement",
        vendor: "Microsoft Azure",
        type: "IT Services",
        value: "$250,000",
        endDate: "15 Dec 2026",
        status: "active",
        risk: "low",
    },
    {
        id: "CTR-002",
        title: "Software Licensing Contract",
        vendor: "Adobe Inc.",
        type: "Software",
        value: "$85,000",
        endDate: "30 Sep 2026",
        status: "expiring",
        risk: "medium",
    },
    {
        id: "CTR-003",
        title: "Office Lease Agreement",
        vendor: "DLF Properties",
        type: "Real Estate",
        value: "$420,000",
        endDate: "12 Jan 2027",
        status: "active",
        risk: "low",
    },
    {
        id: "CTR-004",
        title: "Consulting Services",
        vendor: "Accenture",
        type: "Consulting",
        value: "$120,000",
        endDate: "08 Aug 2026",
        status: "draft",
        risk: "medium",
    },
    {
        id: "CTR-005",
        title: "Security Maintenance",
        vendor: "Cisco",
        type: "Security",
        value: "$98,000",
        endDate: "20 Jul 2026",
        status: "expired",
        risk: "high",
    },
];
export default function ContractTable({
    view,
    searchTerm,
    activeTab,
}) {

    const filteredContracts = contracts.filter((contract) => {

        const matchesSearch =
            contract.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            contract.vendor
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesTab =
            activeTab === "all" ||
            contract.status === activeTab;

        return matchesSearch && matchesTab;
    });

    if (view === "grid") {

        return (

            <div className="contract-grid">

                {filteredContracts.map((contract) => (

                    <div
                        className="contract-card"
                        key={contract.id}
                    >

                        <div className="card-top">

                            <div>

                                <div className="card-badges">

                                    <span
                                        className={`status-badge ${contract.status}`}
                                    >
                                        {contract.status}
                                    </span>

                                    <span
                                        className={`risk-badge ${contract.risk}`}
                                    >
                                        {contract.risk} Risk
                                    </span>

                                </div>

                            </div>

                            <div className="card-menu">

                                <MoreHorizontal size={18} />

                            </div>

                        </div>

                        <h3>{contract.title}</h3>

                        <span className="vendor">
                            {contract.vendor}
                        </span>

                        <div className="card-divider"></div>

                        <div className="card-info">

                            <div className="info-block">
                                <span className="info-label">
                                    Contract Value
                                </span>

                                <span className="info-value">
                                    {contract.value}
                                </span>
                            </div>

                            <div className="info-block">
                                <span className="info-label">
                                    End Date
                                </span>

                                <span className="info-value">
                                    {contract.endDate}
                                </span>
                            </div>

                            <div className="info-block">
                                <span className="info-label">
                                    Type
                                </span>

                                <span className="info-value">
                                    {contract.type}
                                </span>
                            </div>

                            <div className="info-block">
                                <span className="info-label">
                                    Contract ID
                                </span>

                                <span className="info-value">
                                    {contract.id}
                                </span>
                            </div>

                        </div>

                        <div className="card-footer">

                            <button>
                                View Details
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        );

    }
        return (

        <div className="table-container">

            <table className="contract-table">

                <thead>

                    <tr>
                        <th>Contract</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th>Risk</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {filteredContracts.length > 0 ? (

                        filteredContracts.map((contract) => (

                            <tr key={contract.id}>

                                <td>

                                    <div className="contract-name">

                                        <strong>
                                            {contract.title}
                                        </strong>

                                        <span>
                                            {contract.vendor}
                                        </span>

                                    </div>

                                </td>

                                <td>
                                    {contract.type}
                                </td>

                                <td>
                                    {contract.value}
                                </td>

                                <td>
                                    {contract.endDate}
                                </td>

                                <td>

                                    <span
                                        className={`status-badge ${contract.status}`}
                                    >
                                        {contract.status}
                                    </span>

                                </td>

                                <td>

                                    <span
                                        className={`risk-badge ${contract.risk}`}
                                    >
                                        {contract.risk}
                                    </span>

                                </td>

                                <td>

                                    <div className="table-actions">

                                        <button
                                            className="action-btn"
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            className="action-btn"
                                            title="Edit"
                                        >
                                            <Pencil size={16} />
                                        </button>

                                        <button
                                            className="action-btn"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>

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
                                    padding: "60px",
                                }}
                            >

                                <div className="empty-state">

                                    <h3>
                                        No Contracts Found
                                    </h3>

                                    <p>
                                        Try changing your search or filter
                                        criteria.
                                    </p>

                                </div>

                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

            <div className="pagination">

                <div className="pagination-info">

                    Showing
                    {" "}
                    {filteredContracts.length}
                    {" "}
                    contracts

                </div>

                <div className="pagination-controls">

                    <button className="page-btn">
                        1
                    </button>

                    <button className="page-btn active">
                        2
                    </button>

                    <button className="page-btn">
                        3
                    </button>

                </div>

            </div>

        </div>

    );

}