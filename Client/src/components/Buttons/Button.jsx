import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // primary, outline, icon, text
  size = 'md', // sm, md, lg
  className = '', 
  type = 'button',
  icon: Icon,
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'btn';
  const variantClass = variant === 'icon' ? 'btn-icon' : `btn-${variant}`;
  const sizeClass = variant !== 'icon' && size === 'sm' ? 'text-sm px-3 py-1' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      type={type} 
      className={`${baseClasses} ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()} 
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
      {children}
    </button>
  );
};

export default Button;
