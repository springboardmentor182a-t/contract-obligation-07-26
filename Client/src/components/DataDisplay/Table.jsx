import React from 'react';

const Table = ({ children, className = '' }) => {
  return (
    <div className="table-container">
      <table className={`data-table ${className}`.trim()}>
        {children}
      </table>
    </div>
  );
};

export default Table;
