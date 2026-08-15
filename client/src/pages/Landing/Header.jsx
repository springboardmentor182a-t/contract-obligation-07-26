import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSignature, Sun, Moon } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const Header = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUI();

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-indigo-600 p-2 rounded-lg">
              <FileSignature className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              ContractIQ
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors px-4 py-2"
            >
              Sign In
            </button>
          </div>
          
        </div>
      </div>
    </header>
  );
};

export default Header;
