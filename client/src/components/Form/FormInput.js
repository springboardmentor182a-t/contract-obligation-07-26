<<<<<<< HEAD
import React from 'react';
=======
import React from "react";
>>>>>>> origin/main-group-D

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

<<<<<<< HEAD
export default FormInput;
=======
export default FormInput;
>>>>>>> origin/main-group-D
