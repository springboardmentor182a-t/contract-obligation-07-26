import React from 'react';

const AIAnalysisHeader = ({ onRefresh, loading, anomalyScore, riskScore }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center">
            <i className="fa-solid fa-microchip-ai text-base"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Hybrid AI Intelligence
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-[#8E9BAE] mt-0.5">
          Predictive KNN Risk Regressor & OpenAI Digital Fraud Forensics
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-60 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          {loading ? (
            <><i className="fa-solid fa-circle-notch fa-spin"></i><span>Analyzing...</span></>
          ) : (
            <><i className="fa-solid fa-arrows-rotate"></i><span>Re-run AI Analysis</span></>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIAnalysisHeader;
