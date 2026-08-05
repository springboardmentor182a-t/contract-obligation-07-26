import React, { useState } from "react";

function TaskSearch({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div
      style={{
        marginBottom: "20px",
      }}
    >
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={handleChange}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          outline: "none",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default TaskSearch;