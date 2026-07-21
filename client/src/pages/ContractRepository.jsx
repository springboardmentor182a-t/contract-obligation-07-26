import React, { useState } from "react";
import SummaryCards from "../components/ContractRepository/SummaryCards";
import ContractSearch from "../components/ContractRepository/ContractSearch";
import FilterTabs from "../components/ContractRepository/FilterTabs";
import ViewToggle from "../components/ContractRepository/ViewToggle";
import ContractTable from "../components/ContractRepository/ContractTable";
import "../styles/contract-repository.css";

import {
    Upload,
    Download,
    Plus
} from "lucide-react";

export default function ContractRepository() {

    const [view, setView] = useState("grid");
    const [activeTab, setActiveTab] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    return (

        <div className="contract-repository-page">

            {/* Header */}

            <div className="contract-repository-header">

                <div className="header-left">

                    <h1>Contract Repository</h1>

                    <p>
                        Manage, search and organize all contracts from one place.
                    </p>

                    <span className="last-updated">
                        Last Updated: Today • 09:45 AM
                    </span>

                </div>

                <div className="header-actions">

                    <button className="outline-btn">
                        <Upload size={18} />
                        Upload
                    </button>

                    <button className="outline-btn">
                        <Download size={18} />
                        Export
                    </button>

                    <button className="primary-btn">
                        <Plus size={18} />
                        New Contract
                    </button>

                </div>

            </div>

            {/* Summary */}

            <SummaryCards />

            {/* Search */}

            <ContractSearch
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Toolbar */}

            <div className="filter-toolbar">

                <FilterTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                <ViewToggle
                    view={view}
                    setView={setView}
                />

            </div>

            {/* Contracts */}

            <ContractTable
                view={view}
                searchTerm={searchTerm}
                activeTab={activeTab}
            />

        </div>

    );

}