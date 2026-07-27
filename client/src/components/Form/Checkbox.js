import React from 'react';

const Checkbox = ({ label, checked, onChange, id }) => {
  return (
    <div className="checkbox-wrapper">
      <input 
        type="checkbox" 
        id={id} 
        checked={checked} 
        onChange={onChange} 
      />
      {label && <label htmlFor={id} style={{ marginLeft: '8px' }}>{label}</label>}
    </div>
  );
};

export default Checkbox;