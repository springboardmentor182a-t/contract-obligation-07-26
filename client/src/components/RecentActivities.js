import React from "react";
import { FileText, AlertTriangle, Users, Clock, CheckCircle, Shield } from "lucide-react";

export default function RecentActivities() {
  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title">Recent Activities</h3>
        <button className="chart-header-link">View all</button>
      </div>
      <div className="activities-list">
        <div className="activity-row">
          <div className="activity-icon-wrapper color-green">
            <FileText className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">CTR-2024-003 approved by Legal Manager</p>
            <span className="activity-timestamp">5 min ago</span>
          </div>
        </div>

        <div className="activity-row">
          <div className="activity-icon-wrapper color-orange">
            <AlertTriangle className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">High risk flag raised on CTR-2024-005</p>
            <span className="activity-timestamp">22 min ago</span>
          </div>
        </div>

        <div className="activity-row">
          <div className="activity-icon-wrapper color-blue">
            <Users className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">New user James Wilson added to Finance dept</p>
            <span className="activity-timestamp">1 hr ago</span>
          </div>
        </div>

        <div className="activity-row">
          <div className="activity-icon-wrapper color-red">
            <Clock className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">OBL-004 overdue – Property Insurance Renewal</p>
            <span className="activity-timestamp">2 hrs ago</span>
          </div>
        </div>

        <div className="activity-row">
          <div className="activity-icon-wrapper color-green">
            <CheckCircle className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">OBL-003 marked complete by Sarah Lin</p>
            <span className="activity-timestamp">3 hrs ago</span>
          </div>
        </div>

        <div className="activity-row">
          <div className="activity-icon-wrapper color-blue">
            <FileText className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">CTR-2024-006 draft created by Sarah Lin</p>
            <span className="activity-timestamp">5 hrs ago</span>
          </div>
        </div>

        <div className="activity-row">
          <div className="activity-icon-wrapper color-teal">
            <Shield className="activity-row-icon" />
          </div>
          <div className="activity-info-wrapper">
            <p className="activity-description">Compliance score updated to 84%</p>
            <span className="activity-timestamp">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
