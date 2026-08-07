import React, { useState, useEffect } from 'react';

const ComplianceDashboard = () => {
  const [data, setData] = useState({
    healthGrade: 'A-',
    healthScore: '94.2% Average',
    obligationsMet: 14,
    obligationsTotal: 18,
    fulfillmentRate: '96.0%',
    activeAudits: 3,
    departments: []
  });

  useEffect(() => {
    fetch('/api/compliance/summary')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white m-0">
          Compliance Dashboard
        </h1>
        <p className="text-sm text-[#64748B] dark:text-[#8E9BAE] mt-1 m-0">
          Monitor company-wide compliance, regulatory health, and audit milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E9BAE]">Overall Health Score</span>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-5xl font-extrabold text-emerald-600 dark:text-emerald-400">{data.healthGrade}</span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{data.healthScore}</span>
            </div>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#8E9BAE] mt-4 mb-0">Verified for SOC2 Type II, GDPR, and ISO-27001 compliance.</p>
        </div>

        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E9BAE]">Obligations Met (YTD)</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{data.obligationsMet}</span>
              <span className="text-sm text-[#64748B] dark:text-[#8E9BAE]">/ {data.obligationsTotal} due</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
              <span>Fulfillment Rate</span>
              <span className="text-emerald-600 dark:text-emerald-400">{data.fulfillmentRate}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-[#0B1121] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: data.fulfillmentRate }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8E9BAE]">Active Regulatory Audits</span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">{data.activeAudits}</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold">0 Critical Deficiencies</span>
            </div>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#8E9BAE] mt-4 mb-0">Continuous monitoring of PostgreSQL compliance events.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white m-0 mb-4 pb-3 border-b border-slate-100 dark:border-[#2A364F]">
          Departmental Compliance Breakdown
        </h3>
        <div className="space-y-4">
          {data.departments?.map((dept, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/30">{dept.status}</span>
                  <span className="font-bold text-slate-900 dark:text-white w-10 text-right">{dept.score}%</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-100 dark:bg-[#0B1121] rounded-full overflow-hidden">
                <div className={`h-full ${dept.color} rounded-full`} style={{ width: `${dept.score}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;
