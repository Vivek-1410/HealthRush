import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReminderForm from './ReminderForm';
import ReminderList from './ReminderList';
import AlarmPage from './AlarmPage';
import './App.css';

function App() {
  const [reminders, setReminders] = useState([]);
  const [currentAlarm, setCurrentAlarm] = useState(null);
  const [notification, setNotification] = useState(null);
  const alarmAudioRef = useRef(null);
  const timeoutRefs = useRef([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('reminders')) || [];
    setReminders(stored);
    scheduleAllAlarms(stored);
    
    return () => {
      timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const scheduleAllAlarms = useCallback((reminders) => {
    timeoutRefs.current.forEach(timeout => clearTimeout(timeout));
    timeoutRefs.current = [];
    
    reminders.forEach(reminder => {
      const nextAlarmTime = getNextAlarmTime(reminder);
      if (nextAlarmTime) {
        const delay = nextAlarmTime - new Date();
        if (delay > 0) {
          const timeoutId = setTimeout(() => {
            triggerAlarm(reminder);
          }, delay);
          timeoutRefs.current.push(timeoutId);
        }
      }
    });
  }, []);

  const getNextAlarmTime = (reminder) => {
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
      } else {
        return null;
      }
    }
    return target;
  };

  const triggerAlarm = (reminder) => {
    setCurrentAlarm(reminder);
    if (alarmAudioRef.current) {
      alarmAudioRef.current.play().catch(err => {
        console.warn("Playback blocked:", err);
        setNotification("Please allow audio to play alarms");
        setTimeout(() => setNotification(null), 3000);
      });
    }
    if (reminder.frequency !== 'once') {
      const nextTime = getNextAlarmTime(reminder);
      if (nextTime) {
        const delay = nextTime - new Date();
        if (delay > 0) {
          const timeoutId = setTimeout(() => triggerAlarm(reminder), delay);
          timeoutRefs.current.push(timeoutId);
        }
      }
    }
  };

  const stopAlarm = useCallback(() => {
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
    setCurrentAlarm(null);
  }, []);

  const handleNewReminder = useCallback((newReminder) => {
    const updated = [...reminders, { ...newReminder, id: Date.now() }];
    setReminders(updated);
    localStorage.setItem('reminders', JSON.stringify(updated));
    scheduleAllAlarms(updated);
    setNotification("Reminder added successfully!");
    setTimeout(() => setNotification(null), 3000);
  }, [reminders, scheduleAllAlarms]);

  const deleteReminder = useCallback((id) => {
    const updated = reminders.filter(reminder => reminder.id !== id);
    setReminders(updated);
    localStorage.setItem('reminders', JSON.stringify(updated));
    scheduleAllAlarms(updated);
    setNotification("Reminder deleted");
    setTimeout(() => setNotification(null), 3000);
  }, [reminders, scheduleAllAlarms]);

  return (
    <div className="app-container">
      <audio ref={alarmAudioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" preload="auto" />
      
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}
      
      {currentAlarm ? (
        <AlarmPage reminder={currentAlarm} onStop={stopAlarm} />
      ) : (
        <>
          <h1 className="app-title">Medicine Reminder</h1>
          <ReminderForm onSetReminder={handleNewReminder} />
          <ReminderList 
            reminders={reminders} 
            onDelete={deleteReminder} 
          />
        </>
      )}
    </div>
  );
}

export default App;