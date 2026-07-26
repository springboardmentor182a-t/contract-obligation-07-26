import React from "react";

const weekDays = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function CalendarGrid({
  events,
  currentDate,
  onEditEvent,
}) {
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  const totalDays = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const previousMonthDays = new Date(
    currentYear,
    currentMonth,
    0
  ).getDate();

  const cells = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({
      day: previousMonthDays - i,
      current: false,
      month: currentMonth - 1,
      year: currentYear,
    });
  }

  // Current month days
  for (let day = 1; day <= totalDays; day++) {
    cells.push({
      day,
      current: true,
      month: currentMonth,
      year: currentYear,
    });
  }

  // Next month days
  const totalCells =
    Math.ceil((firstDay + totalDays) / 7) * 7;

    while (cells.length < totalCells) {
        cells.push({
            day: cells.length - (firstDay + totalDays) + 1,
            current: false,
            month: currentMonth + 1,
            year: currentYear,
        });
    }

  const getEvents = (cell) => {
  return events.filter((event) => {
    if (!event.start_date) return false;

    const date = new Date(event.start_date);

    return (
      date.getDate() === cell.day &&
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear &&
      cell.current
    );
  });
};

const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  return new Date(1970, 0, 1, Number(hour), Number(minute)).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

  return (
    <div className="calendar-grid">

      <div className="calendar-weekdays">
        {weekDays.map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-days">
        {cells.map((cell, index) => {
            const dayEvents = getEvents(cell);

            return (
                <div
                    key={index}
                    className={
                        cell.current
                        ? "calendar-cell"
                        : "calendar-cell other-month"
                    }
                >
            <div
                className={
                    cell.day === currentDate.getDate() &&
                    cell.current
                        ? "day-number today"
                        : "day-number"
                }
            >
                {cell.day}
            </div>

            {dayEvents
                .slice(0, 2)
                .map((event) => (
                    <div
                    key={event.id}
                    className="calendar-event"
                    style={{
                        background: event.color || "#2563eb",
                    }}
                    onClick={() => onEditEvent(event)}
                    >
                    <strong title={event.title}>
                        {event.title.length > 18
                            ? event.title.substring(0,18) + "..."
                            : event.title}
                    </strong>

                    <small>
                    🕒 {formatTime(event.start_time)}
                </small>
                    </div>
                ))}

                {dayEvents.length > 2 && (
                    <div className="more-events">
                        +{dayEvents.length - 2} more
                    </div>
                )}
          </div>
        );
      })}
      </div>

    </div>
  );
}

export default CalendarGrid;