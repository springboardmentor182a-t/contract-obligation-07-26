import React, { useState } from 'react';

const ClauseHighlighter = ({ rawText = '', anomalies = [] }) => {
  const [activeTooltip, setActiveTooltip] = useState(null);

  return (
    <div className="bg-white dark:bg-[#161F2E] border border-slate-200 dark:border-[#2A364F] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <i className="fa-solid fa-highlighter text-amber-500"></i>
            Contract Clause Anomaly Inspector
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#8E9BAE]">
            Hover over highlighted clauses to inspect liability risks and recommended mitigations
          </p>
        </div>
        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          {anomalies.length} Flagged Clause(s)
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#0B1121] p-4 rounded-xl border border-slate-200 dark:border-[#2A364F] max-h-72 overflow-y-auto">
        {anomalies.length > 0 ? (
          anomalies.map((item, idx) => (
            <div key={idx} className="relative group border-b border-slate-200/60 dark:border-slate-800 pb-3 last:border-b-0">
              <span
                onMouseEnter={() => setActiveTooltip(idx)}
                onMouseLeave={() => setActiveTooltip(null)}
                className="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded cursor-pointer border border-amber-300 dark:border-amber-700/60 hover:bg-amber-200 transition-colors inline-block"
              >
                <i className="fa-solid fa-flag text-[10px] mr-1.5 text-amber-600"></i>
                "{item.clause_text}"
              </span>

              {/* Interactive Tooltip Card */}
              {activeTooltip === idx && (
                <div className="mt-2 p-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 text-xs font-sans z-20 transition-all animate-fadeIn">
                  <div className="flex items-center justify-between gap-2 mb-1.5 font-bold">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-virus"></i>
                      {item.issue_type}
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-red-600 text-white">{item.severity}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mb-2">{item.explanation}</p>
                  <div className="bg-slate-800 p-2 rounded-lg border border-slate-700 text-[11px] text-emerald-300">
                    <strong>Mitigation: </strong>{item.recommendation}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="font-sans text-slate-500">No anomalous clauses detected. All terms meet enterprise standards.</p>
        )}
      </div>
    </div>
  );
};

export default ClauseHighlighter;
