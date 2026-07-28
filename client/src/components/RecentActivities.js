import React, { useEffect, useState } from "react";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function RecentActivities() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/contracts/recent-activities`)
      .then((res) => res.json())
      .then((data) => setActivities(data))
      .catch((err) => console.error("Error fetching activities:", err));
  }, []);

  return (
    <div className="card details-card">
      <div className="chart-header">
        <h3 className="chart-card-title">Recent Activities</h3>
        <button className="chart-header-link">View all</button>
      </div>

      <div className="activities-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-row">
            <div className={`activity-icon-wrapper ${activity.color}`}>
              <span>{activity.icon}</span>
            </div>

            <div className="activity-info-wrapper">
              <p className="activity-description">
                {activity.description}
              </p>
              <span className="activity-timestamp">
                {activity.time}
              </span>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="activity-description">
            No recent activities available.
          </p>
        )}
      </div>
    </div>
  );
}