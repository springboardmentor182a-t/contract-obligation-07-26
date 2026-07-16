import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  // variants: success, warning, danger, primary, default
  const badgeClass = variant === 'default' ? 'badge' : `badge badge-${variant}`;
  
  return (
    <span className={`${badgeClass} ${className}`.trim()}>
      {children}
    </span>
  );
};

export default Badge;
