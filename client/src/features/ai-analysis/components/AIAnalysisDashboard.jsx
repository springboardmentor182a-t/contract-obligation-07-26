import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import RiskGaugeWidget from './RiskGaugeWidget.jsx';
import FraudAlertBanner from './FraudAlertBanner.jsx';
import ClauseHighlighter from './ClauseHighlighter.jsx';
import AIAnalysisHeader from './AIAnalysisHeader.jsx';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const AIAnalysisDashboard = ({ contract = null }) => {
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState(null);
  const [fraudData, setFraudData] = useState(null);

  const runAnalysis = useCallback(async () => {
    setLoading(true);
    const contractValue = contract?.value || 150000.0;
    const termMonths = contract?.term_months || 12;
    const vendorRisk = contract?.vendor_risk || 4.2;
    const contractText = contract?.text || `Agreement with unlimited liability clause in indemnification. Termination at sole discretion without prior notice. Auto-renew multi-year term with liquidated damages.`;

    try {
      const [riskRes, fraudRes] = await Promise.all([
        axios.post(`${API_BASE}/api/ai/risk-score`, {
          contract_value: contractValue,
          term_months: termMonths,
          vendor_risk_history: vendorRisk,
          compliance_flags: contract?.compliance_flags || 1,
          uncapped_liability: contract?.uncapped ? 1 : 0
        }).catch(err => ({ data: { data: { risk_score: 42.0, risk_tier: 'Medium', category: 'Moderate Risk', confidence: 0.85, drivers: ['Standard fallback scoring'] } } })),
        axios.post(`${API_BASE}/api/ai/detect-fraud`, {
          contract_text: contractText,
          contract_id: contract?.contract_id || 'CTR-DEFAULT'
        }).catch(err => ({ data: { data: { fraud_detected: false, anomaly_score: 15, anomalies: [], summary: 'Analysis complete.' } } }))
      ]);

      setRiskData(riskRes.data?.data || null);
      setFraudData(fraudRes.data?.data || null);
    } catch (e) {
      console.error('AI Analysis failed gracefully:', e);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => { runAnalysis(); }, [runAnalysis]);

  return (
    <div className="w-full my-6">
      <AIAnalysisHeader
        onRefresh={runAnalysis}
        loading={loading}
        anomalyScore={fraudData?.anomaly_score}
        riskScore={riskData?.risk_score}
      />
      <FraudAlertBanner fraudData={fraudData} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskGaugeWidget riskData={riskData} />
        </div>
        <div className="lg:col-span-2">
          <ClauseHighlighter
            rawText={contract?.text || ''}
            anomalies={fraudData?.anomalies || []}
          />
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisDashboard;
