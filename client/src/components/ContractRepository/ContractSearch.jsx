import React from "react";
import { Search } from "lucide-react";

export default function ContractSearch({
    value = "",
    onChange = () => {},
}) {
    return (
        <div className="contract-search-container">
            <div className="search-box">
                <Search size={18} />

                <input
                    type="text"
                    placeholder="AI Smart Search contracts, vendors, clauses..."
                    value={value}
                    onChange={onChange}
                />
            </div>
        </div>
    );
}