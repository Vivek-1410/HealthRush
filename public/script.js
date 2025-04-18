let exerciseData = {
  Running: 
  { low: 0.063, medium: 0.08, high: 0.1 },
  Walking: 
  { low: 0.045, medium: 0.06, high: 0.075 },
  Cycling: 
  { low: 0.05, medium: 0.07, high: 0.09 },
  Yoga: 
  { low: 0.03, medium: 0.04, high: 0.05 },
};

function calcCalorie() {
  let type = document.querySelector('#exerciseType').value;
  let duration = document.querySelector('#duration').value;
  let intensity = document.querySelector('#intensity').value;
  let weight = document.querySelector('#weight').value;
  let caloriesBurnedInput = document.querySelector('#caloriesBurnedInput');

  let caloriepermin = exerciseData[type][intensity];
  let caloriesBurned = caloriepermin * duration * weight;
  document.querySelector('.result-value').textContent = caloriesBurned.toFixed(2);
  caloriesBurnedInput.value = caloriesBurned.toFixed(2);
}






function toggleCustomDays() {
  const frequency = document.getElementById("reminderFrequency").value;
  const customDaysDiv = document.getElementById("customDays");

  if (frequency === "custom") {
      customDaysDiv.style.display = "block";
  } else {
      customDaysDiv.style.display = "none";
  }
}

document.addEventListener('DOMContentLoaded', function() {
  toggleCustomDays();
});

function showSetReminderForm() {
  document.getElementById("reminderForm").style.display = "block";
  document.getElementById("reminderList").style.display = "none";
}
function viewAllReminders() {
  const reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  const reminderList = document.getElementById("reminders");
  reminderList.innerHTML = "";

  if (reminders.length === 0) {
      reminderList.innerHTML = "<li>No reminders set!</li>";
  } else {
      reminders.forEach((reminder, index) => {
          const li = document.createElement("li");
          li.classList.add("reminder-list-item");

          let reminderDetails = `${reminder.medicineName} - ${reminder.reminderTime} - ${reminder.frequency}`;
          
          if (reminder.frequency === "custom" && reminder.customDays.length > 0) {
              reminderDetails += ` (Days: ${reminder.customDays.join(', ')})`;  
          }

          li.textContent = reminderDetails;

          const deleteBtn = document.createElement("button");
          deleteBtn.textContent = "Delete";
          deleteBtn.classList.add("delete-btn");
          deleteBtn.onclick = () => deleteReminder(index);

          li.appendChild(deleteBtn);
          reminderList.appendChild(li);
      });
  }

  document.getElementById("reminderForm").style.display = "none";
  document.getElementById("reminderList").style.display = "block";
}

function setReminder(event) {
  event.preventDefault();
  const medicineName = document.getElementById("medicineName").value;
  const reminderTime = document.getElementById("reminderTime").value;
  const reminderFrequency = document.getElementById("reminderFrequency").value;
  const customDays = [];

  if (reminderFrequency === "custom") {
      if (document.getElementById("monday").checked) customDays.push("Monday");
      if (document.getElementById("tuesday").checked) customDays.push("Tuesday");
      if (document.getElementById("wednesday").checked) customDays.push("Wednesday");
      if (document.getElementById("thursday").checked) customDays.push("Thursday");
      if (document.getElementById("friday").checked) customDays.push("Friday");
      if (document.getElementById("saturday").checked) customDays.push("Saturday");
      if (document.getElementById("sunday").checked) customDays.push("Sunday");
  }

  const reminder = { medicineName, reminderTime, frequency: reminderFrequency, customDays };
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.push(reminder);

  localStorage.setItem("reminders", JSON.stringify(reminders));

  alert("Reminder set successfully!");

  const reminderDate = new Date();
  const timeParts = reminderTime.split(":");
  reminderDate.setHours(timeParts[0], timeParts[1], 0, 0);

  const currentTime = new Date();
  const timeDifference = reminderDate - currentTime;

  if (timeDifference > 0) {
      setTimeout(() => {
          playAlarm(reminder);
      }, timeDifference);
  } else {
      alert("Reminder time must be in the future!");
  }

  document.getElementById("medicineName").value = "";
  document.getElementById("reminderTime").value = "";
  toggleCustomDays();  
  document.getElementById("customDays").style.display = "none";  
}



function goBack() {
  document.getElementById("reminderList").style.display = "none";
  document.getElementById("reminderForm").style.display = "none";
}

function playAlarm(reminder) {
  document.getElementById("reminderPage").style.display = "none";
  document.getElementById("alarmPage").style.display = "block";

  const alarmMessage = document.getElementById("alarmMessage");
  alarmMessage.textContent = `It's time to take your ${reminder.medicineName}!`;

  const alarmSound = document.getElementById("alarmSound");
  alarmSound.play().catch((error) => {
      console.log("Error playing the sound:", error);
  });

  document.getElementById("stopButtonContainer").style.display = "block";
}

function stopAlarm() {
  const alarmSound = document.getElementById("alarmSound");
  alarmSound.pause();
  alarmSound.currentTime = 0;

  document.getElementById("stopButtonContainer").style.display = "none";
  document.getElementById("alarmPage").style.display = "none";
  document.getElementById("reminderPage").style.display = "block";
}

function deleteReminder(index) {
  let reminders = JSON.parse(localStorage.getItem("reminders")) || [];
  reminders.splice(index, 1); 
  localStorage.setItem("reminders", JSON.stringify(reminders));

  viewAllReminders();
}