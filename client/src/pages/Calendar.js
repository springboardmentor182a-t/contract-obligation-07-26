import React, { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";

import CalendarToolbar from "../components/Calendar/CalendarToolbar";
import CalendarGrid from "../components/Calendar/CalendarGrid";
import MiniCalendar from "../components/Calendar/MiniCalendar";
import UpcomingEvents from "../components/Calendar/UpcomingEvents";
import AddEventModal from "../components/Calendar/AddEventModal";
import EditEventModal from "../components/Calendar/EditEventModal";

import { getCalendarEvents } from "../services/calendarServices";

import "../styles/calendar.css";

function Calendar() {
  const [events, setEvents] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedView, setSelectedView] = useState("month");
  const [selectedType, setSelectedType] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      const data = await getCalendarEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditEvent = (event) => {
  setSelectedEvent(event);
  setIsEditModalOpen(true);
};

  useEffect(() => {
    fetchEvents();
  }, []);


  const filteredEvents =
    selectedType === "All"
      ? events
      : events.filter(
          (event) =>
            event.event_type &&
            event.event_type.toLowerCase() ===
              selectedType.toLowerCase()
        );

  return (
    <div className="calendar-page">

      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="calendar-body">

          <div className="page-heading">
            <h1>Calendar</h1>

            <p>
              View and manage compliance dates,
              meetings and reminders.
            </p>
          </div>

          <CalendarToolbar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            selectedView={selectedView}
            setSelectedView={setSelectedView}
            onAddEvent={() => setIsAddModalOpen(true)}
            />

          <div className="calendar-content">

            <div className="calendar-left">

                <CalendarGrid
                events={filteredEvents}
                currentDate={currentDate}
                selectedView={selectedView}
                onEditEvent={handleEditEvent}
                />

            </div>

            <div className="calendar-right">

                <MiniCalendar
                currentDate={currentDate}
                />

                <div className="calendar-filter">

                <h3>Filter by Type</h3>

                <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option value="All">All Types</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Audit">Audit</option>
                    <option value="Contract">Contract</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Obligation">Obligation</option>
                </select>

                </div>

                <UpcomingEvents events={filteredEvents} />

            </div>

            </div>

        </div>

      </div>
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        refreshEvents={fetchEvents}
        />
        <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            event={selectedEvent}
            refreshEvents={fetchEvents}
            />

    </div>
  );
}

export default Calendar;