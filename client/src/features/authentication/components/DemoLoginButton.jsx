import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

const DemoLoginButton = ({ onDemoLogin, isLoading }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className="mt-4 pt-4 border-t border-slate-700/40 text-center">
      <button
        type="button"
        onClick={onDemoLogin}
        disabled={isLoading}
        className={`w-full py-2.5 rounded-xl font-semibold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2 ${
          isDarkMode
            ? 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/60 hover:text-white'
            : 'bg-gray-100 hover:bg-gray-200 text-slate-700 border-gray-200'
        }`}
      >
        <i className="fa-solid fa-bolt text-amber-400"></i>
        <span>One-Click Demo Sandbox Login</span>
      </button>
    </div>
  );
};

export default DemoLoginButton;
