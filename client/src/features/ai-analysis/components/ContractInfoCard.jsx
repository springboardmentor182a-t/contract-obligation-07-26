import React from 'react';

const ContractInfoCard = ({ contract }) => {
  if (!contract) return null;

  return (
    <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center text-xl">
            <i className="fa-solid fa-file-signature"></i>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {contract.title || contract.vendor || 'Enterprise Master Services Agreement'}
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-[#8E9BAE]">
              ID: {contract.contract_id || contract.id || 'CTR-2026-8941'}
            </span>
          </div>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <i className="fa-solid fa-circle text-[8px] mr-1.5 animate-pulse"></i>
          {contract.status || 'Active'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F]">
          <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Vendor / Client</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{contract.vendor || 'Acme Global Corp'}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F]">
          <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Contract Value</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">${(contract.value || 250000).toLocaleString()}</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F]">
          <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Term Length</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">{contract.term_months || 24} Months</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B1121] border border-slate-200 dark:border-[#2A364F]">
          <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Governing Law</span>
          <span className="font-bold text-slate-800 dark:text-slate-200">State of Delaware</span>
        </div>
      </div>
    </div>
  );
};

export default ContractInfoCard;
