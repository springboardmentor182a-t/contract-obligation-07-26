import React from 'react';

const FormSelect = ({ label, name, value, onChange, options = [], error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'form-input-error' : ''}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormSelect;
