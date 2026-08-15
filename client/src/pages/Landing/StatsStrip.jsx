import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FileText, DollarSign, Zap, ShieldCheck } from 'lucide-react';

const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  "https://contract-obligation-demo-group-c.onrender.com/api";

const StatsStrip = () => {
  const [stats, setStats] = useState({
    totalContracts: 2000,
    totalValue: 120,
    executionSpeed: 73,
    complianceScore: 99.9
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_BASE}/public/stats`);
        if (response.data) {
          setStats({
            totalContracts: response.data.totalContracts || 2000,
            totalValue: response.data.totalValue || 120,
            executionSpeed: response.data.executionSpeed || 73,
            complianceScore: response.data.complianceScore || 99.9
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats, using fallbacks.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num);
  };

  return (
    <section className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 rounded-full mb-4">
              <FileText className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {formatNumber(stats.totalContracts)}+
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Contracts Managed</p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              ${formatNumber(stats.totalValue)}M+
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Value Protected</p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-full mb-4">
              <Zap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.executionSpeed}%
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Faster Execution</p>
          </div>

          <div className="flex flex-col items-center text-center p-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {stats.complianceScore}%
            </h3>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Compliance Score</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsStrip;
