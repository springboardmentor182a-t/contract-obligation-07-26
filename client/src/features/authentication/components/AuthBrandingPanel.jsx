import React from 'react';
import HeroShield from '../../../components/HeroShield.jsx';

const AuthBrandingPanel = ({ isDarkMode }) => {
  return (
    <div className={`hidden lg:flex lg:w-1/2 items-center justify-center flex-col relative overflow-hidden p-12 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-[#0f172a] via-[#161f2e] to-[#0b1121] border-l border-slate-800' 
        : 'bg-[#1E3A8A] text-white'
    }`}>
      <div className="z-10 text-center max-w-md flex flex-col items-center justify-center">
        <div className="w-64 h-64 mb-6 drop-shadow-2xl">
          <HeroShield />
        </div>
        <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-white">
          Enterprise Grade Security
        </h2>
        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-blue-100'}`}>
          End-to-end encrypted contract intelligence, continuous obligation tracking, and automated risk detection.
        </p>
        
        <div className="grid grid-cols-2 gap-3 mt-8 w-full text-left">
          <div className={`p-3.5 rounded-xl border text-xs ${
            isDarkMode 
              ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' 
              : 'bg-white/10 border-white/20 text-white'
          }`}>
            <i className="fa-solid fa-database text-blue-400 mb-1.5 block text-sm"></i>
            <span className="font-bold block">PostgreSQL Core</span>
            <span className="text-[11px] opacity-80">Full relational ACID transactions</span>
          </div>
          <div className={`p-3.5 rounded-xl border text-xs ${
            isDarkMode 
              ? 'bg-slate-900/60 border-slate-700/60 text-slate-300' 
              : 'bg-white/10 border-white/20 text-white'
          }`}>
            <i className="fa-solid fa-shield-cat text-emerald-400 mb-1.5 block text-sm"></i>
            <span className="font-bold block">Google SSO 2.0</span>
            <span className="text-[11px] opacity-80">OAuth2 enterprise authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBrandingPanel;
