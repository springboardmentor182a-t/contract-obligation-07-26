import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100 dark:border-[#2A364F]">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white m-0">{title}</h2>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-lg cursor-pointer"
          >
            &times;
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
