import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoAccess = async () => {
    setLoadingDemo(true);
    try {
      const response = await axios.post(`${API_BASE}/api/auth/demo-login`);
      if (response.data && (response.data.token || response.data.access_token)) {
        localStorage.setItem('token', response.data.token || response.data.access_token);
        localStorage.setItem('userName', response.data.user?.name || 'Demo User');
        localStorage.setItem('userEmail', response.data.user?.email || 'demo@contractiq.com');
        navigate('/dashboard');
        return;
      }
      navigate('/login');
    } catch (error) {
      console.warn('Demo login API fallback to login page:', error);
      navigate('/login');
    } finally {
      setLoadingDemo(false);
    }
  };

  const stats = [
    { label: 'Obligation Precision', value: '99.9%', desc: 'AI accuracy score on clauses' },
    { label: 'Audit Cycle Speed', value: '10x', desc: 'Faster compliance reviews' },
    { label: 'Penalty Risk Prevented', value: '$2.4M+', desc: 'Across enterprise portfolios' },
    { label: 'Monitored Obligations', value: '50,000+', desc: 'Live tracked in real-time' }
  ];

  const features = [
    {
      icon: 'fa-solid fa-file-shield',
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      title: 'Automated Obligation Extraction',
      description: 'Deep neural models analyze multi-page agreements to instantly isolate deliverables, milestones, and penalty clauses.'
    },
    {
      icon: 'fa-solid fa-chart-line-up',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      title: 'Real-Time Compliance Audits',
      description: 'Continuous validation against SOC2, GDPR, HIPAA, and internal enterprise policies with proactive compliance alerts.'
    },
    {
      icon: 'fa-solid fa-arrows-rotate',
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      title: 'Smart Renewal Workflows',
      description: 'Never miss an opt-out window. Automated alerts ensure renewals are negotiated on optimal commercial terms.'
    },
    {
      icon: 'fa-solid fa-triangle-exclamation',
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      title: 'AI Risk & Liability Scoring',
      description: 'Instant heuristic risk ratings pinpoint aggressive indemnities, uncapped liability, and high-risk terms.'
    },
    {
      icon: 'fa-solid fa-lock',
      color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      title: 'Enterprise Role-Based Access',
      description: 'Strict granular permissions with Google OAuth2 SSO, multi-tenant isolation, and encrypted PostgreSQL storage.'
    },
    {
      icon: 'fa-solid fa-clock-rotate-left',
      color: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      title: 'Immutable Audit Trail',
      description: 'Complete tamper-proof logging of every contract upload, amendment review, status change, and approval step.'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1121] text-white' : 'bg-[#F8FAFC] text-slate-900'} font-sans relative overflow-x-hidden`}>
      {/* Background ambient lighting */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-indigo-600/15 blur-[140px] pointer-events-none"></div>

      {/* Navigation Bar */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors ${
        isDarkMode ? 'bg-[#0B1121]/80 border-slate-800/80' : 'bg-white/80 border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <i className="fa-solid fa-shield-halved text-white text-lg"></i>
            </div>
            <div>
              <span className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E3A8A]'}`}>
                Contract<span className="text-blue-500">IQ</span>
              </span>
              <span className={`block text-[9px] uppercase font-bold tracking-widest ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Enterprise Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <i className="fa-solid fa-sun text-amber-400"></i> : <i className="fa-solid fa-moon text-blue-600"></i>}
            </button>

            <Link
              to="/login"
              className={`hidden sm:inline-flex px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
                isDarkMode ? 'text-slate-300 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-[#1E3A8A] hover:bg-slate-100'
              }`}
            >
              Sign In
            </Link>

            <button
              onClick={handleDemoAccess}
              disabled={loadingDemo}
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loadingDemo ? (
                <><i className="fa-solid fa-spinner fa-spin"></i><span>Provisioning...</span></>
              ) : (
                <><i className="fa-solid fa-bolt"></i><span>Access Demo</span></>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border mb-8 ${
          isDarkMode 
            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' 
            : 'bg-blue-50 text-blue-700 border-blue-200'
        }`}>
          <i className="fa-solid fa-sparkles text-blue-500"></i>
          <span>Next-Gen Enterprise Contract Governance 2.0</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Transform How Your Organization Handles{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-teal-400">
            Customer Contracts
          </span>
        </h1>

        <p className={`text-base sm:text-xl max-w-3xl mx-auto mb-10 leading-relaxed ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          ContractIQ provides automated obligation extraction, real-time SLA risk monitoring, and seamless audit workflows powered by enterprise-grade AI intelligence.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Request a Demo / Sign In</span>
            <i className="fa-solid fa-arrow-right"></i>
          </Link>

          <button
            onClick={handleDemoAccess}
            disabled={loadingDemo}
            className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-3 cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700 hover:text-white' 
                : 'bg-white hover:bg-gray-50 text-slate-700 border-gray-300 shadow-sm'
            }`}
          >
            <i className="fa-solid fa-desktop text-blue-500"></i>
            <span>Interactive Live Sandbox</span>
          </button>
        </div>
      </section>

      {/* 4-Column Stats Strip */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-2xl border ${
          isDarkMode 
            ? 'bg-[#161F2E] border-[#2A364F] shadow-2xl' 
            : 'bg-white border-slate-200 shadow-lg'
        }`}>
          {stats.map((item, idx) => (
            <div key={idx} className="text-center p-3">
              <div className="text-3xl sm:text-4xl font-black text-blue-500 mb-1">
                {item.value}
              </div>
              <div className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-1 ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {item.label}
              </div>
              <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3x2 Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Enterprise-Grade Contract Features
          </h2>
          <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Purpose-built to help legal, finance, and operations teams eliminate contract blindspots.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className={`p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                isDarkMode 
                  ? 'bg-[#161F2E] border-[#2A364F] hover:border-blue-500/50 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-5 border ${feat.color}`}>
                <i className={feat.icon}></i>
              </div>
              <h3 className={`text-lg font-bold mb-2.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {feat.title}
              </h3>
              <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-[#8E9BAE]' : 'text-slate-600'}`}>
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Call to Action */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        <div className={`p-10 sm:p-14 rounded-3xl border relative overflow-hidden ${
          isDarkMode 
            ? 'bg-gradient-to-b from-[#161F2E] to-[#0B1121] border-[#2A364F]' 
            : 'bg-gradient-to-b from-blue-50 to-white border-blue-200 shadow-xl'
        }`}>
          <h3 className={`text-2xl sm:text-3xl font-extrabold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to Take Control of Your Contract Lifecycle?
          </h3>
          <p className={`text-sm sm:text-base max-w-xl mx-auto mb-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Join enterprise compliance teams using ContractIQ to protect revenue and automate obligation adherence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white hover:bg-gray-100 text-slate-700 border-gray-300 shadow-sm'
              }`}
            >
              Enterprise Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t py-8 px-6 text-center text-xs ${
        isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-500">ContractIQ</span>
            <span>&copy; {new Date().getFullYear()} Enterprise Contract Intelligence. All rights reserved.</span>
          </div>
          <div className="flex gap-6">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
            <span className="text-emerald-500 font-semibold"><i className="fa-solid fa-circle text-[8px] mr-1"></i>System Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
