import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ label, items = [], onSelect, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      <button 
        className="btn dropdown-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {label} <ChevronDown size={16} />
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          {items.map((item, index) => (
            <div 
              key={index} 
              className="dropdown-item"
              onClick={() => {
                onSelect && onSelect(item);
                setIsOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
