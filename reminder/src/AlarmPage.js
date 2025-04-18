import React, { useRef, useState } from 'react';
import './AlarmPage.css';

function AlarmPage({ reminder, onStop }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartAlarm = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error("Autoplay failed:", err);
          document.addEventListener('click', handleStartAlarm, { once: true });
        });
    }
  };

  const handleStopAlarm = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    onStop();
  };

  return (
    <div className="alarm-page">
      <h2>It's time to take your {reminder.medicineName}!</h2>
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" loop />
      {!isPlaying ? (
        <button className="reminder-button start" onClick={handleStartAlarm}>
          Start Alarm
        </button>
      ) : (
        <button className="reminder-button stop" onClick={handleStopAlarm}>
          Stop Alarm
        </button>
      )}
    </div>
  );
}

export default AlarmPage;