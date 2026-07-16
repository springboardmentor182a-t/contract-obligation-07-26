import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = '', 
  glow = true,
  noPadding = false
}) => {
  const baseClasses = 'card';
  const glowClass = glow ? 'glow-card' : '';
  const paddingClass = noPadding ? 'p-0' : '';
  
  return (
    <div className={`${baseClasses} ${glowClass} ${paddingClass} ${className}`.trim()}>
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
