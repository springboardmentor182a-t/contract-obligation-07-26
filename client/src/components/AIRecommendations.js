import React, { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function AIRecommendations() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/contracts/ai-recommendations`)
      .then((res) => res.json())
      .then((data) => setRecommendations(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title flex-title-row">
          <Sparkles className="title-magic-icon" />
          AI Recommendations
        </h3>
      </div>

      <div className="recommendations-list">
        {recommendations.map((item, index) => (
          <div key={index} className={`rec-box ${item.color}`}>
            <div className="rec-box-left">
              <span>{item.icon}</span>
              <span>{item.message}</span>
            </div>

            <ArrowRight className="rec-arrow" />
          </div>
        ))}
      </div>
    </div>
  );
}