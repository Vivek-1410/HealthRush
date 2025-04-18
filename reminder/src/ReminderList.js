import React from 'react';
import './ReminderList.css';

function ReminderList({ reminders, onDelete }) {
  const getNextDueDate = (reminder) => {
    const now = new Date();
    const [h, m] = reminder.reminderTime.split(':').map(Number);
    const target = new Date();
    target.setHours(h, m, 0, 0);

    if (target < now) {
      if (reminder.frequency === 'daily') {
        target.setDate(target.getDate() + 1);
      } else if (reminder.frequency === 'weekly') {
        target.setDate(target.getDate() + 7);
      } else if (reminder.frequency === 'monthly') {
        target.setMonth(target.getMonth() + 1);
      } else if (reminder.frequency === 'custom' && reminder.customDays.length > 0) {
        const currentDay = now.getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const daysToAdd = reminder.customDays
          .map(day => dayNames.indexOf(day))
          .sort((a, b) => a - b)
          .find(dayIndex => dayIndex > currentDay) || 
          (7 - currentDay + reminder.customDays.map(day => dayNames.indexOf(day)).sort((a, b) => a - b)[0]);
        target.setDate(target.getDate() + daysToAdd);
      }
    }
    
    return target.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="reminder-list">
      <h2>Your Reminders</h2>
      {reminders.length === 0 ? (
        <p className="no-reminders">No reminders set yet!</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id} className="reminder-item">
              <div className="reminder-info">
                <h3>{reminder.medicineName}</h3>
                <p><strong>Next Dose:</strong> {getNextDueDate(reminder)}</p>
                <p><strong>Quantity:</strong> {reminder.remainingQuantity}/{reminder.totalQuantity} {reminder.unit}</p>
                <p><strong>Dose:</strong> {`reminder.doseQuantity} {reminder.unit} {reminder.frequency === 'custom' ? on ${reminder.customDays.join(', ')} : reminder.frequency`}</p>
              </div>
              <button 
                className="delete-btn"
                onClick={() => onDelete(reminder.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReminderList;