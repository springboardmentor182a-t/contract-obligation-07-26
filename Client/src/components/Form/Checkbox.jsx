import React from 'react';

const Checkbox = ({ label, name, checked, onChange, ...props }) => {
  return (
    <label className="checkbox-wrapper">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="checkbox-input"
        {...props}
      />
      <span className="checkbox-label">{label}</span>
    </label>
  );
};

export default Checkbox;
