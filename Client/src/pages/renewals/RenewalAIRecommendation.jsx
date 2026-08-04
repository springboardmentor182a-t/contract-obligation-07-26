import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BrainCircuit, Activity, FileText, CheckCircle2,
  AlertTriangle, Info, Clock, AlertOctagon, TrendingUp,
  ShieldAlert, RefreshCcw
} from 'lucide-react';
import Button from '../../components/Buttons/Button';
import { getRenewalAIRecommendation, getRenewalById } from '../../features/renewals/services/renewalAPI';
import './RenewalAIRecommendation.css';

const RenewalAIRecommendation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recommendation, setRecommendation] = useState(null);
  const [renewal, setRenewal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [renewalData, aiData] = await Promise.all([
        getRenewalById(id),
        getRenewalAIRecommendation(id)
      ]);
      setRenewal(renewalData);
      setRecommendation(aiData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError(err.message || 'Failed to load AI recommendation details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'high': return 'var(--danger)';
      default: return 'var(--text-muted)';
    }
  };

  const getRiskIcon = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return <CheckCircle2 size={24} color="var(--success)" />;
      case 'medium': return <AlertTriangle size={24} color="var(--warning)" />;
      case 'high': return <AlertOctagon size={24} color="var(--danger)" />;
      default: return <Info size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="ai-rec-loading">
        <div className="ai-spinner-container">
          <BrainCircuit className="ai-spinner-icon" size={48} />
        </div>
        <p>Analyzing contract history and formulating recommendations...</p>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="ai-rec-error fade-in">
        <AlertTriangle size={48} className="error-icon" />
        <h2>Analysis Failed</h2>
        <p>{error || "Unable to generate AI recommendation at this time."}</p>
        <div className="error-actions">
          <Button variant="outline" onClick={() => navigate(`/renewals/${id}`)}>← Back to Renewal</Button>
          <Button variant="primary" onClick={fetchData} icon={RefreshCcw}>Retry Analysis</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-rec-container fade-in">
      <div className="ai-rec-header">
        <div className="rd-back-link" onClick={() => navigate(`/renewals/${id}`)}>
          <ArrowLeft size={18} />
          <span>Back to Renewal Details</span>
        </div>
        
        <div className="ai-title-section">
          <div className="ai-title-icon">
            <BrainCircuit size={32} />
          </div>
          <div>
            <h1 className="ai-title">AI Recommendation</h1>
            <p className="ai-subtitle">Intelligent insights for <strong>{recommendation.contract_name}</strong></p>
          </div>
        </div>
      </div>

      <div className="ai-rec-grid">
        {/* Main Recommendation Card */}
        <div className="ai-card main-rec-card glass-panel">
          <div className="ai-card-header">
            <h2 className="ai-card-title">Verdict</h2>
            {!recommendation.ai_generated && (
              <span className="fallback-badge"><ShieldAlert size={14} /> Fallback Mode</span>
            )}
          </div>
          <div className="main-rec-content">
            <div className="rec-verdict-box">
              <span className="rec-verdict-label">Recommended Action</span>
              <h3 className="rec-verdict-value">{recommendation.recommendation}</h3>
            </div>
            
            <div className="rec-metrics">
              <div className="metric-box">
                <div className="metric-header">
                  <Activity size={18} />
                  <span>Confidence Score</span>
                </div>
                <div className="metric-value-container">
                  <span className="metric-value">{recommendation.confidence}%</span>
                  <div className="metric-bar-bg">
                    <div 
                      className="metric-bar-fill" 
                      style={{ 
                        width: `${recommendation.confidence}%`,
                        backgroundColor: recommendation.confidence > 80 ? 'var(--success)' : recommendation.confidence > 50 ? 'var(--warning)' : 'var(--danger)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-header">
                  <ShieldAlert size={18} />
                  <span>Risk Level</span>
                </div>
                <div className="metric-value-container flex-center-start">
                  {getRiskIcon(recommendation.risk_level)}
                  <span 
                    className="metric-value ml-2"
                    style={{ color: getRiskColor(recommendation.risk_level) }}
                  >
                    {recommendation.risk_level}
                  </span>
                </div>
              </div>
            </div>

            <div className="rec-action-box">
              <div className="action-header">
                <TrendingUp size={18} />
                <h4>Suggested Next Step</h4>
              </div>
              <p className="action-text">{recommendation.action}</p>
              <Button variant="primary" onClick={() => navigate(`/renewals/${id}`)}>
                Go to Renewal Panel
              </Button>
            </div>
          </div>
        </div>

        {/* Supporting Reasons Card */}
        <div className="ai-card reasons-card glass-panel">
          <div className="ai-card-header">
            <h2 className="ai-card-title">
              <FileText size={20} />
              Key Factors
            </h2>
          </div>
          <div className="reasons-list">
            {recommendation.reasons && recommendation.reasons.length > 0 ? (
              recommendation.reasons.map((reason, index) => (
                <div key={index} className="reason-item">
                  <div className="reason-icon">
                    <CheckCircle2 size={20} />
                  </div>
                  <p className="reason-text">{reason}</p>
                </div>
              ))
            ) : (
              <p className="no-reasons-text">No specific factors were provided by the analysis engine.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="ai-footer-info">
        <Info size={16} />
        <p>This recommendation is generated by ContractIQ AI based on current renewal parameters, historical approvals, and contract configuration. It is intended to assist human decision-making, not replace it.</p>
      </div>
    </div>
  );
};

export default RenewalAIRecommendation;
