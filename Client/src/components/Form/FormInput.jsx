import React from 'react';

const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, error, ...props }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name} className="form-label">{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'form-input-error' : ''}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

export default FormInput;
