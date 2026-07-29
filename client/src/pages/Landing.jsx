import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/demo-login');
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.user.name);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error logging into demo:', error);
      alert('Failed to launch demo. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B1121] text-white' : 'bg-slate-50 text-slate-900'} font-sans relative overflow-hidden`}>
      {/* Background Mesh Gradient elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] mix-blend-multiply pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/20 blur-[120px] mix-blend-multiply pointer-events-none"></div>

      {/* Navbar */}
      <nav className={`flex justify-between items-center px-8 py-6 border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'} relative z-10`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <i className="fa-solid fa-shield-halved text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold tracking-tight">ContractIQ</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={toggleTheme} className="text-2xl hover:scale-110 transition-transform focus:outline-none">
            {isDarkMode ? <i className="fa-solid fa-moon text-blue-400"></i> : <i className="fa-solid fa-sun text-amber-500"></i>}
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className={`font-semibold px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-slate-200'}`}
          >
            Login / Register
          </button>

          <button 
            onClick={handleDemoAccess}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md shadow-blue-600/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            {loading ? (
              <><i className="fa-solid fa-spinner fa-spin"></i> Provisioning...</>
            ) : (
              'Access Demo'
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Contract Compliance, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">Automated and Secured.</span>
          </h1>
          
          <p className={`text-xl md:text-2xl max-w-2xl mx-auto ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
            Extract obligations, track renewals, and mitigate risks in real-time with our AI-powered legal intelligence platform.
          </p>

          <div className="pt-8">
            <button 
              onClick={handleDemoAccess}
              disabled={loading}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_-10px_rgba(37,99,235,0.7)]"
            >
              {loading ? (
                <><i className="fa-solid fa-circle-notch fa-spin mr-3"></i> Provisioning Environment...</>
              ) : (
                <>
                  Access Interactive Demo
                  <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Abstract 3D Glass Mockup */}
        <div className="mt-20 relative w-full max-w-5xl perspective-1000">
          <div className={`relative w-full rounded-2xl overflow-hidden shadow-2xl transform rotate-x-12 scale-95 transition-transform duration-700 hover:rotate-x-0 hover:scale-100 border ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur-xl p-6`}>
             <div className="flex gap-4 items-center mb-6 border-b pb-4 border-slate-500/20">
               <div className="flex gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
               </div>
               <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Dashboard Overview</div>
             </div>
             
             {/* Mock Dashboard internals */}
             <div className="grid grid-cols-3 gap-6">
                <div className={`col-span-1 h-32 rounded-xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'} p-4 flex flex-col justify-between`}>
                  <div className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-200'} flex items-center justify-center`}><i className="fa-solid fa-file-contract text-blue-500"></i></div>
                  <div>
                    <div className="text-2xl font-bold">124</div>
                    <div className="text-xs text-slate-500">Active Contracts</div>
                  </div>
                </div>
                <div className={`col-span-2 h-32 rounded-xl border ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-100 border-slate-200'} p-4`}>
                  <div className="w-full h-full flex items-end gap-2">
                    {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-teal-400 rounded-t-sm transition-all" style={{height: `${h}%`}}></div>
                    ))}
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Bento-Box Feature Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Powerful tools, simple workflow.</h2>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Designed to scale with your legal team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {/* Smart Renewals - Large Box */}
          <div className={`col-span-1 md:col-span-2 row-span-1 md:row-span-2 rounded-3xl p-8 border ${isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-200'} shadow-sm relative overflow-hidden group hover:border-blue-500/50 transition-colors`}>
             <div className="relative z-10 h-full flex flex-col">
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 text-xl shadow-inner"><i className="fa-solid fa-rotate"></i></div>
               <h3 className="text-2xl font-bold mb-3">Smart Renewals</h3>
               <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} max-w-md`}>Never miss a deadline. Automated alerts for upcoming renewals with contextual insights on performance and obligations.</p>
             </div>
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          </div>

          {/* Risk Tracking */}
          <div className={`col-span-1 row-span-1 rounded-3xl p-8 border ${isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-200'} shadow-sm group hover:border-amber-500/50 transition-colors`}>
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mb-4 text-lg shadow-inner"><i className="fa-solid fa-triangle-exclamation"></i></div>
            <h3 className="text-xl font-bold mb-2">Risk Tracking</h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Identify high-liability clauses and non-standard terms instantly.</p>
          </div>

          {/* AI Analysis */}
          <div className={`col-span-1 row-span-1 rounded-3xl p-8 border ${isDarkMode ? 'bg-slate-800/50 border-white/5' : 'bg-white border-slate-200'} shadow-sm group hover:border-teal-500/50 transition-colors`}>
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-4 text-lg shadow-inner"><i className="fa-solid fa-brain"></i></div>
            <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Intelligent redlining and contract summarization powered by NLP.</p>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Landing;
