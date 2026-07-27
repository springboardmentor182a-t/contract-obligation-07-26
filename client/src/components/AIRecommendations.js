import React from "react";
import { Sparkles, AlertTriangle, AlertCircle, Clock, ArrowRight } from "lucide-react";

export default function AIRecommendations() {
  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Sparkles className="title-magic-icon" />
          AI Recommendations
        </h3>
      </div>
      <div className="recommendations-list">
        <div className="rec-box color-pink">
          <div className="rec-box-left">
            <AlertTriangle className="rec-icon-danger" />
            <span>Initiate renewal for CTR-2024-005 — expires in 25 days</span>
          </div>
          <ArrowRight className="rec-arrow" />
        </div>

        <div className="rec-box color-yellow">
          <div className="rec-box-left">
            <AlertCircle className="rec-icon-warning" />
            <span>3 contracts lack signed addendums — compliance risk</span>
          </div>
          <ArrowRight className="rec-arrow" />
        </div>

        <div className="rec-box color-light-yellow">
          <div className="rec-box-left">
            <Clock className="rec-icon-info" />
            <span>Marketing dept compliance below 70% threshold</span>
          </div>
          <ArrowRight className="rec-arrow" />
        </div>
      </div>
    </div>
  );
}
