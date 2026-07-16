import React from 'react';

const FormInput = ({ label, type, value, onChange, placeholder, required }) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}
      <input
        type={type || 'text'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-control"
      />
    </div>
  );
};

export default FormInput;