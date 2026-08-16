import React, { useState } from 'react';

const FraudAlertBanner = ({ fraudData }) => {
  const [dismissed, setDismissed] = useState(false);

  if (!fraudData || dismissed) return null;
  const { fraud_detected, anomaly_score = 0, anomalies = [], tampering_markers = [], summary } = fraudData;
  if (!fraud_detected && anomalies.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-950 via-red-900 to-rose-950 text-white rounded-2xl p-5 mb-6 border border-red-800 shadow-xl relative overflow-hidden transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center shrink-0 mt-0.5">
            <i className="fa-solid fa-triangle-exclamation text-red-400 text-lg"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-sm text-red-100">Digital Fraud & Anomaly Alert</span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded bg-red-800 text-red-200 border border-red-700">
                Score: {anomaly_score}/100
              </span>
              {tampering_markers.length > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-900/80 text-amber-200 border border-amber-700">
                  {tampering_markers.length} Tampering Marker(s)
                </span>
              )}
            </div>
            <p className="text-xs text-red-200/90 leading-relaxed max-w-3xl mb-3">{summary}</p>
            
            {/* Anomalies List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              {anomalies.map((item, idx) => (
                <div key={idx} className="bg-red-950/70 border border-red-800/80 rounded-lg p-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-red-300">{item.issue_type}</span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      item.severity === 'Critical' ? 'bg-red-600 text-white' : 'bg-amber-600/60 text-amber-100'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-red-100/80 line-clamp-2">{item.explanation}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-red-300 hover:text-white p-1 rounded-lg hover:bg-red-800/50 transition-colors"
          title="Dismiss Alert"
        >
          <i className="fa-solid fa-xmark text-sm"></i>
        </button>
      </div>
    </div>
  );
};

export default FraudAlertBanner;
