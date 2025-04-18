import React, { useState } from 'react';
import './ReminderForm.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function ReminderForm({ onSetReminder }) {
  const [medicineName, setMedicineName] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [customDays, setCustomDays] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSetReminder({ medicineName, reminderTime, frequency, customDays });
    setMedicineName('');
    setReminderTime('');
    setFrequency('daily');
    setCustomDays([]);
  };

  const handleCustomDayChange = (day) => {
    setCustomDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="reminder-form">
      <h2>Set Reminder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Medicine Name"
          className="reminder-input"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          required
        />
        <input
          type="time"
          className="reminder-input"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          required
        />
        <select
          className="reminder-input"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>

        {frequency === 'custom' && (
          <div className="custom-days">
            <label>Select Days:</label><br />
            {days.map((day) => (
              <label key={day} className="day-checkbox">
                <input
                  type="checkbox"
                  checked={customDays.includes(day)}
                  onChange={() => handleCustomDayChange(day)}
                />
                {day}
              </label>
            ))}
          </div>
        )}

        <button type="submit" className="reminder-button">
          Set Reminder
        </button>
      </form>
    </div>
  );
}

export default ReminderForm;