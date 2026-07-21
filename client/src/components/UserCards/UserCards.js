import React from "react";
import {
  FiUsers,
  FiUserCheck,
  FiShield,
  FiClock,
} from "react-icons/fi";

import "../../styles/userCards.css";

function UserCards({ users }) {
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const adminUsers = users.filter(
    (user) =>
      user.role === "Admin" ||
      user.role === "Administrator"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "Pending"
  ).length;

  const cards = [
    {
      icon: <FiUsers />,
      title: "Total Users",
      value: totalUsers,
      sub: "Registered Users",
      color: "#ede9fe",
    },
    {
      icon: <FiUserCheck />,
      title: "Active Users",
      value: activeUsers,
      sub: "Currently Active",
      color: "#dcfce7",
    },
    {
      icon: <FiShield />,
      title: "Administrators",
      value: adminUsers,
      sub: "Admin Accounts",
      color: "#dbeafe",
    },
    {
      icon: <FiClock />,
      title: "Pending Users",
      value: pendingUsers,
      sub: "Awaiting Approval",
      color: "#fef3c7",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stat-card" key={card.title}>
          <div
            className="stat-icon"
            style={{ background: card.color }}
          >
            {card.icon}
          </div>

          <div>
            <h4>{card.title}</h4>
            <h2>{card.value}</h2>
            <span>{card.sub}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserCards;