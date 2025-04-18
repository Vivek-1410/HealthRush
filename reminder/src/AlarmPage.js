import React from 'react';
import './AlarmPage.css';

function AlarmPage({ reminder, onStop }) {
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    const playAlarm = () => {
      if (audioRef.current) {
        audioRef.current.play()
          .catch(err => {
            console.error("Autoplay failed:", err);
            const handleFirstInteraction = () => {
              audioRef.current.play().catch(console.error);
              document.removeEventListener('click', handleFirstInteraction);
            };
            document.addEventListener('click', handleFirstInteraction);
          });
      }
    };

    playAlarm();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleStopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onStop(reminder);
  };

  return (
    <div className="alarm-page">
      <div className="alarm-content">
        <h2>Time to take your medication!</h2>
        <div className="medicine-info">
          <h3>{reminder.medicineName}</h3>
          <p><strong>Dose:</strong> {reminder.doseQuantity} {reminder.unit}</p>
          <p><strong>Remaining:</strong> {reminder.remainingQuantity} {reminder.unit}</p>
        </div>
        <audio 
          ref={audioRef} 
          src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" 
          loop 
        />
        <button className="stop-btn" onClick={handleStopAlarm}>
          I've taken my medicine
        </button>
      </div>
    </div>
  );
}

export default AlarmPage;