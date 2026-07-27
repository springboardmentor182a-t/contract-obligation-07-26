import React from 'react';

const RadioButton = ({ label, name, value, checked, onChange, id }) => {
  return (
    <div className="radio-wrapper">
      <input 
        type="radio" 
        id={id} 
        name={name} 
        value={value} 
        checked={checked} 
        onChange={onChange} 
      />
      {label && <label htmlFor={id} style={{ marginLeft: '8px' }}>{label}</label>}
    </div>
  );
};

export default RadioButton;