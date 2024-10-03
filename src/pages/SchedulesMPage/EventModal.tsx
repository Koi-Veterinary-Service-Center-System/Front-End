import React, { useState, useEffect } from "react";

const EventModal = ({ event, onSave, onClose }) => {
  const [title, setTitle] = useState(event?.Subject || "");
  const [location, setLocation] = useState(event?.Location || "");
  const [startTime, setStartTime] = useState(event?.StartTime || new Date());
  const [endTime, setEndTime] = useState(event?.EndTime || new Date());

  const handleSave = () => {
    const newEvent = {
      ...event,
      Subject: title,
      Location: location,
      StartTime: startTime,
      EndTime: endTime,
    };
    onSave(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">
          {event ? "Edit Event" : "New Event"}
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Start Time</label>
          <input
            type="datetime-local"
            value={new Date(startTime).toISOString().slice(0, 16)}
            onChange={(e) => setStartTime(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">End Time</label>
          <input
            type="datetime-local"
            value={new Date(endTime).toISOString().slice(0, 16)}
            onChange={(e) => setEndTime(new Date(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
