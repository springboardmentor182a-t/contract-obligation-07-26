import React from 'react';

const Dropdown = ({ options, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)} className="dropdown-select">
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;