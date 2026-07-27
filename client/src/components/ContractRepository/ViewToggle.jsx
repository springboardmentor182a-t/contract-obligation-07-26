import React from "react";
import { LayoutGrid, List } from "lucide-react";

export default function ViewToggle({ view, setView }) {
    return (
        <div className="view-toggle">

            <button
                className={view === "grid" ? "active" : ""}
                onClick={() => setView("grid")}
                title="Grid View"
            >
                <LayoutGrid size={18} />
            </button>

            <button
                className={view === "table" ? "active" : ""}
                onClick={() => setView("table")}
                title="Table View"
            >
                <List size={18} />
            </button>

        </div>
    );
}