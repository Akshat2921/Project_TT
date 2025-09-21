const timetableForm = document.getElementById("timetableForm");
const errorMsg = document.getElementById("errorMsg");

let editIndex = null;
let timetable = JSON.parse(localStorage.getItem("weeklyTimetable")) || [];

renderTable();

timetableForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const subject = document.getElementById("subject").value;
    const professor = document.getElementById("professor").value;
    const day = document.getElementById("day").value;

    const startTimeValue = document.getElementById("startTime").value; // e.g., "10:30"
    const endTimeValue = document.getElementById("endTime").value;     // e.g., "12:00"
    const startAMPM = document.getElementById("startAMPM").value;
    const endAMPM = document.getElementById("endAMPM").value;

    if (!day) {
        errorMsg.textContent = "⚠️ Please select a day.";
        return;
    }

    // Combine time with AM/PM for display
    const startDisplay = `${startTimeValue} ${startAMPM}`;
    const endDisplay = `${endTimeValue} ${endAMPM}`;

    // Convert to 24-hour format for conflict check
    const startTime = convertTo24HourFromInput(startTimeValue, startAMPM);
    const endTime = convertTo24HourFromInput(endTimeValue, endAMPM);

    // Conflict check
    if (hasConflict(day, startTime, endTime, editIndex)) {
        errorMsg.textContent = "⚠️ Time conflict detected on " + day + "!";
        return;
    } else {
        errorMsg.textContent = "";
    }

    const entry = {
        subject,
        professor,
        day,
        startTime,
        endTime,
        startDisplay,
        endDisplay
    };

    if (editIndex === null) {
        timetable.push(entry);
    } else {
        timetable[editIndex] = entry;
        editIndex = null;
    }

    saveAndRender();
    timetableForm.reset();
});

// Convert "HH:MM" + AM/PM to 24-hour format for conflict checking
function convertTo24HourFromInput(timeValue, ampm) {
    let [hour, minute] = timeValue.split(":").map(Number);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
}

// Format for display in Time column
function formatTimeDisplay(item) {
    return `${item.startDisplay} - ${item.endDisplay}`;
}


// Check if new class conflicts with existing classes
function hasConflict(day, start, end, skipIndex) {
  return timetable.some((item, index) => {
    if (index === skipIndex) return false;
    if (item.day !== day) return false;
    return !(end <= item.startTime || start >= item.endTime);
  });
}

function renderTable() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Clear all columns
    document.querySelectorAll(".day-column ul, .time-column ul").forEach(ul => ul.innerHTML = "");

    // Sort timetable by startTime
    timetable.sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Get unique time slots
    const timeSlots = [...new Set(timetable.map(item => `${item.startTime} - ${item.endTime}`))];

    // Render Time column
    const timeUl = document.querySelector("#Time ul");
    timeSlots.forEach(slot => {
        const li = document.createElement("li");
        // Find display format from any class with this time
        const displayItem = timetable.find(item => `${item.startTime} - ${item.endTime}` === slot);
        li.textContent = `${displayItem.startDisplay} - ${displayItem.endDisplay}`;
        li.className = "class-card";
        timeUl.appendChild(li);
    });

    // Render each day column
    days.forEach(day => {
        const dayUl = document.querySelector(`#${day} ul`);
        timeSlots.forEach(slot => {
            const li = document.createElement("li");
            li.className = "class-card";
            // Check if there's a class at this time on this day
            const item = timetable.find(t => t.day === day && `${t.startTime} - ${t.endTime}` === slot);
            if (item) {
                li.className = "class-card";
                li.setAttribute("data-time", `${item.startDisplay} - ${item.endDisplay}`); // <-- add this
                li.innerHTML = `
                    <div><strong>${item.subject}</strong></div>
                    <div>${item.professor}</div>
                    <div style="margin-top:6px;">
                        <button class="action-btn edit" onclick="editEntry(${timetable.indexOf(item)})">Edit</button>
                        <button class="action-btn delete" onclick="deleteEntry(${timetable.indexOf(item)})">Delete</button>
                    </div>
                `;
            }
            
            dayUl.appendChild(li);
        });
    });
}

function editEntry(index) {
    const item = timetable[index];
    document.getElementById("subject").value = item.subject;
    document.getElementById("professor").value = item.professor;
    document.getElementById("day").value = item.day;
  
    // Split display into time + AM/PM for start
    let [sTime, sAMPM] = item.startDisplay.split(" ");
    document.getElementById("startTime").value = sTime;
    document.getElementById("startAMPM").value = sAMPM;
  
    // Split display into time + AM/PM for end
    let [eTime, eAMPM] = item.endDisplay.split(" ");
    document.getElementById("endTime").value = eTime;
    document.getElementById("endAMPM").value = eAMPM;
  
    editIndex = index;
  }
  

function deleteEntry(index) {
  timetable.splice(index, 1);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("weeklyTimetable", JSON.stringify(timetable));
  renderTable();
}
