import React from 'react';

const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`btn-group ${className}`}>
      {children}
    </div>
  );
};

export default ButtonGroup;
