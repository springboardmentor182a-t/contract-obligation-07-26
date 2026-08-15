import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 transition-colors duration-300">
          Strong compliance builds stronger organizations.
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed transition-colors duration-300">
          Manage contracts securely, automate approvals, monitor compliance, and reduce organizational risks using AI-powered workflows.
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 text-lg"
          >
            Sign In / Get Started
          </button>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 dark:bg-indigo-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;
