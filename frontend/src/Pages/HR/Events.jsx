import React, { useState, useEffect } from "react";
import { Calendar, Trash2, Plus, X } from "lucide-react";
import { hrAPI } from "../../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await hrAPI.getAllEvents();
      if (response.success) {
        setEvents(response.data || []);
      } else {
        setError(response.message || "Failed to load events");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.event_date) {
      setError("Title and event date are required");
      return;
    }

    try {
      // Convert datetime-local format (2026-02-02T14:30) to MySQL format (2026-02-02 14:30:00)
      const dateTime = formData.event_date.replace("T", " ") + ":00";

      const response = await hrAPI.createEvent(
        formData.title,
        formData.description,
        dateTime,
        formData.location
      );

      if (response.success) {
        setSuccess("Event created successfully!");
        setFormData({
          title: "",
          description: "",
          event_date: "",
          location: "",
        });
        setShowForm(false);
        setTimeout(() => {
          loadEvents();
          setSuccess("");
        }, 1500);
      } else {
        setError(response.message || "Failed to create event");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error creating event");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await hrAPI.deleteEvent(id);
      if (response.success) {
        setSuccess("Event deleted successfully!");
        setTimeout(() => {
          loadEvents();
          setSuccess("");
        }, 1500);
      } else {
        setError(response.message || "Failed to delete event");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={24} className="text-white" />
          <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {error && (
        <div className="m-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="m-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-600 dark:text-green-300 rounded-lg">
          {success}
        </div>
      )}

      {showForm && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Event Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="Event location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:ring-2 focus:ring-violet-500 outline-none"
                  placeholder="Event description"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition"
              >
                Create Event
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6 space-y-4">
        {events.length > 0 ? (
          events.map((event) => (
            <div
              key={event.event_id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>📅 {new Date(event.event_date).toLocaleDateString()}</span>
                    <span>🕐 {new Date(event.event_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    {event.location && <span>📍 {event.location}</span>}
                    <span className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded text-xs">
                      {event.business_unit}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(event.event_id)}
                  className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No events scheduled yet. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
