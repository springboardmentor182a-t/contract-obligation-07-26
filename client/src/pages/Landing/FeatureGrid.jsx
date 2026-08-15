import React from 'react';
import { Database, Activity, RefreshCw, Shield, BarChart, Bell } from 'lucide-react';

const FeatureGrid = () => {
  const features = [
    {
      title: "Contract Repository",
      description: "A centralized, highly secure vault for all your contracts. Find what you need instantly with AI-powered search and metadata extraction.",
      icon: <Database className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Obligation Tracking",
      description: "Automatically extract and monitor key obligations. Ensure your organization meets every commitment and tracks counterparty performance.",
      icon: <Activity className="w-6 h-6 text-emerald-400" />
    },
    {
      title: "Renewal Intelligence",
      description: "Never miss a renewal window. Get proactive insights on expiring agreements with data-driven recommendations on renegotiation.",
      icon: <RefreshCw className="w-6 h-6 text-blue-400" />
    },
    {
      title: "Compliance & Risk Guardian",
      description: "Real-time risk scoring and compliance monitoring. AI identifies non-standard clauses and flags potential regulatory exposures.",
      icon: <Shield className="w-6 h-6 text-rose-400" />
    },
    {
      title: "Audit & Reporting",
      description: "Generate comprehensive audit trails and visual reports with a single click. Keep stakeholders informed with real-time dashboards.",
      icon: <BarChart className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Proactive Notifications",
      description: "Stay ahead of critical dates. Smart alerts notify the right stakeholders via email or in-app messages before deadlines hit.",
      icon: <Bell className="w-6 h-6 text-purple-400" />
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 transition-colors duration-300">Complete Contract Lifecycle Management</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors duration-300">Everything you need to streamline operations and mitigate risk.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl p-6 transition-all duration-300 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:border-slate-600 hover:shadow-lg hover:-translate-y-1 shadow-sm">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900/50 rounded-lg flex items-center justify-center mb-5 border border-slate-100 dark:border-slate-700/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
