import React, { useState } from "react";
import "../../styles/AddEventModal.css";
import { createCalendarEvent } from "../../services/calendarServices";

function AddEventModal({ isOpen, onClose, refreshEvents }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "Meeting",
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    location: "",
    owner: "",
    priority: "Medium",
    status: "Pending",
    color: "#2563eb",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCalendarEvent(formData);

      alert("Event created successfully.");

      refreshEvents();

      onClose();

      setFormData({
        title: "",
        description: "",
        event_type: "Meeting",
        start_date: "",
        end_date: "",
        start_time: "",
        end_time: "",
        location: "",
        owner: "",
        priority: "Medium",
        status: "Pending",
        color: "#2563eb",
      });
    } catch (err) {
      console.error(err);
      alert("Unable to create event.");
    }
  };

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>Add Event</h2>

        <form onSubmit={handleSubmit}>

          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />

          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
          >
            <option>Meeting</option>
            <option>Audit</option>
            <option>Contract</option>
            <option>Compliance</option>
            <option>Obligation</option>
          </select>

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
            required
          />

          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <input
            name="owner"
            placeholder="Owner"
            value={formData.owner}
            onChange={handleChange}
          />

          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />

          <div className="modal-buttons">

            <button type="submit">
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddEventModal;