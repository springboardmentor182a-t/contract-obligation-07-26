import React from 'react';

const RadioButton = ({ label, name, value, checked, onChange, ...props }) => {
  return (
    <label className="radio-wrapper">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="radio-input"
        {...props}
      />
      <span className="radio-label">{label}</span>
    </label>
  );
};

export default RadioButton;
