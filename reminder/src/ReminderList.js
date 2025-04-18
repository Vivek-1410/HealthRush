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
    
    return target.toLocaleString();
  };

  return (
    <div className="reminder-list">
      <h2>All Reminders</h2>
      <ul className="reminder-list-items">
        {reminders.length === 0 ? (
          <li className="no-reminders">No reminders set!</li>
        ) : (
          reminders.map((reminder) => (
            <li key={reminder.id} className="reminder-list-item">
              <div className="reminder-info">
                <span className="medicine-name">{reminder.medicineName}</span>
                <span className="due-date">Due: {getNextDueDate(reminder)}</span>
                <span className="frequency">
                  ({reminder.frequency}
                  {`reminder.frequency === 'custom' && reminder.customDays.length > 0 &&
                    : ${reminder.customDays.join(', ')}`}
                  )
                </span>
              </div>
              <button 
                className="delete-btn" 
                onClick={() => onDelete(reminder.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default ReminderList;