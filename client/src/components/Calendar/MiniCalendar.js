import React from "react";

function MiniCalendar({ currentDate }) {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const totalDays = new Date(year, month + 1, 0).getDate();

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push(day);
  }

  return (
    <div className="mini-calendar">

      <div className="mini-header">
        {monthName} {year}
    </div>

      <div className="mini-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="mini-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="mini-days">
        {cells.map((day, index) => (
          <div
            key={index}
            className={
              day === currentDate.getDate()
                ? "mini-day active-day"
                : "mini-day"
            }
          >
            {day}
          </div>
        ))}
      </div>

    </div>
  );
}

export default MiniCalendar;