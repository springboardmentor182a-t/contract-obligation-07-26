import { API_BASE_URL } from "../data/constants";

const CALENDAR_API = `${API_BASE_URL}/calendar`;

/**
 * Get all calendar events
 */
export const getCalendarEvents = async () => {
  try {
    const response = await fetch(CALENDAR_API);

    if (!response.ok) {
      throw new Error("Failed to fetch calendar events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching calendar events:", error);
    throw error;
  }
};

/**
 * Get single calendar event
 */
export const getCalendarEventById = async (id) => {
  try {
    const response = await fetch(`${CALENDAR_API}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch calendar event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching calendar event:", error);
    throw error;
  }
};

/**
 * Create new calendar event
 */
export const createCalendarEvent = async (eventData) => {
  try {
    const response = await fetch(CALENDAR_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to create calendar event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating calendar event:", error);
    throw error;
  }
};

/**
 * Update calendar event
 */
export const updateCalendarEvent = async (id, eventData) => {
  try {
    const response = await fetch(`${CALENDAR_API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error("Failed to update calendar event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating calendar event:", error);
    throw error;
  }
};

/**
 * Delete calendar event
 */
export const deleteCalendarEvent = async (id) => {
  try {
    const response = await fetch(`${CALENDAR_API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete calendar event");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting calendar event:", error);
    throw error;
  }
};