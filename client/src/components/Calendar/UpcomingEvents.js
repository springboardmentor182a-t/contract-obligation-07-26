import React from "react";

function UpcomingEvents({ events }) {

  const upcomingEvents = [...events]
    .filter((event) => event.start_date)
    .sort(
      (a, b) =>
        new Date(a.start_date) - new Date(b.start_date)
    );

  return (
    <div className="upcoming-events">

      <div className="upcoming-header">
        <h3>Upcoming Events</h3>
      </div>

      {upcomingEvents.length === 0 ? (

        <div className="no-events">
          No upcoming events found.
        </div>

      ) : (

        upcomingEvents.map((event) => (

          <div
            key={event.id}
            className="event-card"
          >

            <div
              className="event-color"
              style={{
                backgroundColor:
                  event.color || "#2563eb"
              }}
            />

            <div className="event-info">

              <h4>{event.title}</h4>

              <p>
                📅 {event.start_date}
              </p>

              <p>
                🕒 {event.start_time}
              </p>

              <p>
                👤 {event.owner}
              </p>

              <div className="event-footer">

                <span
                  className={`status ${event.status?.toLowerCase()}`}
                >
                  {event.status}
                </span>

                <span className="event-type">
                  {event.event_type || "General"}
                </span>

              </div>

            </div>

          </div>

        ))

      )}

    </div>
  );
}

export default UpcomingEvents;