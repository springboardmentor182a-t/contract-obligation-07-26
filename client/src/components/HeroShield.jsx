import React from 'react';

const HeroShield = ({ className = "w-full h-full" }) => {
  return (
    <svg className={className} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGrad" x1="200" y1="50" x2="200" y2="350" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E3A8A" />
          <stop offset="1" stopColor="#0B1C4A" />
        </linearGradient>
        <linearGradient id="checkGrad" x1="150" y1="200" x2="250" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#34D399" />
        </linearGradient>
        <filter id="glow" x="0" y="0" width="400" height="400" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#1E3A8A" floodOpacity="0.3"/>
        </filter>
      </defs>
      
      {/* Background Document */}
      <rect x="90" y="60" width="220" height="280" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="4"/>
      <line x1="130" y1="120" x2="270" y2="120" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round"/>
      <line x1="130" y1="160" x2="270" y2="160" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round"/>
      <line x1="130" y1="200" x2="210" y2="200" stroke="#CBD5E1" strokeWidth="6" strokeLinecap="round"/>
      
      {/* Main Shield */}
      <path d="M200 60 L320 110 V200 C320 280 270 330 200 360 C130 330 80 280 80 200 V110 L200 60 Z" fill="url(#shieldGrad)" filter="url(#glow)"/>
      <path d="M200 60 L320 110 V200 C320 280 270 330 200 360 V60 Z" fill="#ffffff" fillOpacity="0.1"/>
      
      {/* Checkmark */}
      <path d="M150 210 L185 245 L255 160" stroke="url(#checkGrad)" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default HeroShield;
