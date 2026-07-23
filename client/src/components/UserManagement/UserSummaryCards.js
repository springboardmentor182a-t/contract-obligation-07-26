import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";

function UserSummaryCards({ users }) {
  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const departments = new Set(
    users.map((user) => user.department)
  ).size;

  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      iconClass: "blue",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      iconClass: "green",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserX,
      iconClass: "red",
    },
    {
      title: "Departments",
      value: departments,
      icon: Building2,
      iconClass: "purple",
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div className="summary-card" key={card.title}>
            <div>
              <p className="summary-title">{card.title}</p>
              <h2>{card.value}</h2>
            </div>

            <div className={`summary-icon ${card.iconClass}`}>
              <Icon size={24} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default UserSummaryCards;