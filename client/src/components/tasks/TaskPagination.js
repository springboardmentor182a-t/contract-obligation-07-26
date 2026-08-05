import React from "react";

function TaskPagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
}) {
  const buttonStyle = (active) => ({
    width: "38px",
    height: "38px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    background: active ? "#5B2EFF" : "#fff",
    color: active ? "#fff" : "#333",
    fontWeight: "600",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "25px",
      }}
    >
      <p
        style={{
          color: "#666",
          fontSize: "14px",
        }}
      >
        Showing page {currentPage} of {totalPages}
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
        }}
      >
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={buttonStyle(false)}
        >
          &lt;
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPageChange(index + 1)}
            style={buttonStyle(currentPage === index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={buttonStyle(false)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default TaskPagination;