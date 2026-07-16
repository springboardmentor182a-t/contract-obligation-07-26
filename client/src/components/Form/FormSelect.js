import React from 'react';

const FormSelect = ({ label, options, value, onChange, required }) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <select 
        value={value} 
        onChange={onChange} 
        required={required}
        className="form-control"
        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;