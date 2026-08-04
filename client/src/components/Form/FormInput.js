import React from 'react';
const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="form-control"
      />
    </div>
  );
};

export default FormInput;
