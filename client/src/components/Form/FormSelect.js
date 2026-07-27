<<<<<<< HEAD
import React from 'react';
=======
import React from "react";
>>>>>>> origin/main-group-D

const FormSelect = ({ label, options, value, onChange, required }) => {
  return (
    <div className="form-group">
      {label && <label>{label}</label>}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="form-control"
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "5px",
          border: "1px solid #ddd",
        }}
      >
        <option value="" disabled>
          Select an option
        </option>

        {options.map((opt, index) => (
          <option key={index} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

<<<<<<< HEAD
export default FormSelect;
=======
export default FormSelect;
>>>>>>> origin/main-group-D
