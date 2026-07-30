import React from "react";

function CalendarToolbar({
  currentDate,
  setCurrentDate,
  selectedView,
  setSelectedView,
  onAddEvent,
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const previousMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() - 1);
    setCurrentDate(date);
  };

  const nextMonth = () => {
    const date = new Date(currentDate);
    date.setMonth(date.getMonth() + 1);
    setCurrentDate(date);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <button
          className="today-btn"
          onClick={goToToday}
        >
          Today
        </button>

        <button
          className="nav-btn"
          onClick={previousMonth}
        >
          ◀
        </button>

        <button
          className="nav-btn"
          onClick={nextMonth}
        >
          ▶
        </button>

        <h2 className="month-title">
          {months[currentDate.getMonth()]}{" "}
          {currentDate.getFullYear()}
        </h2>
      </div>

      <div className="toolbar-right">
        <button
          className={
            selectedView === "month"
              ? "view-btn active"
              : "view-btn"
          }
          onClick={() => setSelectedView("month")}
        >
          Month
        </button>

        <button
          className={
            selectedView === "week"
              ? "view-btn active"
              : "view-btn"
          }
          onClick={() => setSelectedView("week")}
        >
          Week
        </button>

        <button
          className={
            selectedView === "day"
              ? "view-btn active"
              : "view-btn"
          }
          onClick={() => setSelectedView("day")}
        >
          Day
        </button>

        <button
            className="add-event-btn"
            onClick={onAddEvent}
            >
            + Add Event
            </button>
      </div>
    </div>
  );
}

export default CalendarToolbar;