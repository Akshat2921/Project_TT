// localStorage.clear()
let currentTask = [];
if (localStorage.getItem("currentTask")) {
  currentTask = JSON.parse(localStorage.getItem("currentTask"));
} else {
}
function renderTask() {
  let allTask = document.querySelector(".task-container .allTask");
  if (!allTask) return;

  let sum = "";
  currentTask.forEach(function (elem, idx) {
    sum += `<div class="task">
        <h3>${elem.task}</h3>
        <button id = "${idx}">Completed</button>
      </div>`;
  });
  allTask.innerHTML = sum;

  var taskbutton = document.querySelectorAll(".task button");
  taskbutton.forEach(function (btn) {
    btn.addEventListener("click", function () {
      currentTask.splice(btn.id, 1);
      localStorage.removeItem("currentTask[btn.id]");
      renderTask();
    });
  });
}
// Function to handle card opening
function opencard() {
  let allElem = document.querySelectorAll(".elem");
  let forElem = document.querySelectorAll(".forElem");
  let back = document.querySelectorAll(".back");

  allElem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      document.querySelector("#main1").style.display = "none";
      document.querySelector("#main2").style.display = "block";
      forElem[elem.id].style.display = "block";

      // If this is the task section (id="2"), render the tasks
      if (elem.id === "2") {
        renderTask();
      }
    });
  });
  back.forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelector("#main1").style.display = "flex";
      document.querySelector("#main2").style.display = "none";
      document
        .querySelectorAll(".forElem")
        .forEach((f) => (f.style.display = "none"));
    });
  });
}
document.addEventListener("DOMContentLoaded", function () {
  opencard();
  // Set up form handling
  const form = document.querySelector(".task-container .addTask form");
  const taskInput = document.querySelector(
    ".task-container .addTask form #task-input"
  );
  const tasktextarea = document.querySelector(
    ".task-container .addTask form textarea"
  );

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (taskInput.value.trim()) {
        currentTask.push({
          task: taskInput.value,
          details: tasktextarea.value,
        });
        localStorage.setItem("currentTask", JSON.stringify(currentTask));
        renderTask();

        taskInput.value = "";
        tasktextarea.value = "";
      }
    });
  }
});

function dailyplanner() {
  var dailyplannerdata = {};
  var dailyplannerdata =
    JSON.parse(localStorage.getItem("dailyplannerData")) || {};
  var dailyplanner = document.querySelector(".daily-planner");
  var hours = Array.from(
    { length: 18 },
    (_, idx) => `${6 + idx}:00 - ${7 + idx}:00`
  );
  var wholeday = "";
  hours.forEach(function (elem, idx) {
    var savedData = dailyplannerdata[idx] || "";
    // console.log(savedData);
    wholeday =
      wholeday +
      `<div class="daily-planner-time">
            <p>${6 + idx}:00 - ${7 + idx}:00</p>
            <input  id="${idx}" type="text" placeholder="" value ="${savedData}">
        </div>`;
  });
  dailyplanner.innerHTML = wholeday;
  var dailyplannerInput = document.querySelectorAll(".daily-planner input");
  dailyplannerInput.forEach(function (elem) {
    elem.addEventListener("input", function () {
      dailyplannerdata[elem.id] = elem.value;
      localStorage.setItem(
        "dailyplannerData",
        JSON.stringify(dailyplannerdata)
      );
    });
  });
}
dailyplanner();

async function motivational() {
  var motivationWrapper = document.querySelector(".motivation-wrapper");

  let response = await fetch("https://quotes-api-self.vercel.app/quote");
  let data = await response.json();

  let motivation = "";

  motivation =
    motivation +
    `<div class="motivation1">
                                    <h2>Quote of the Day</h2>
                                </div>
                                <div class="motivation2">
                                    <h1>${data.quote}</h1>
                                </div>
                                <div class="motivation3">
                                    <h2>${data.author}</h2>
                                </div>`;
  motivationWrapper.innerHTML = motivation;
}
motivational();

function Timer() {
  var totalSecond = 1500;
  let timerInterval = null;
  let timer = document.querySelector(".pomo-timer h1");
  let start = document.querySelector(".start-timer");
  let pause = document.querySelector(".pause-timer");
  let reset = document.querySelector(".reset-timer");
  let workStatus = document.querySelector(".workStatus");
  var workSession = true;

  function updateTimer() {
    let minutes = Math.floor(totalSecond / 60);
    let seconds = totalSecond % 60;
    timer.innerHTML = `${String(minutes).padStart("2", "0")}:${String(
      seconds
    ).padStart("2", "0")}`;
  }

  start.addEventListener("click", function () {
    clearInterval(timerInterval);
    if (workSession) {
      timerInterval = setInterval(() => {
        if (totalSecond > 0) {
          totalSecond--;
          updateTimer();
        } else {
          workSession = false;
          clearInterval(timerInterval);
          timer.innerHTML = "05:00";
          workStatus.innerHTML = "Break Time";
          workStatus.style.backgroundColor = "var(--sec)";
          totalSecond = 5 * 60;
        }
      }, 1000);
    } else {
      timerInterval = setInterval(() => {
        if (totalSecond > 0) {
          totalSecond--;
          updateTimer();
        } else {
          workSession = true;
          clearInterval(timerInterval);
          timer.innerHTML = "25:00";
          workStatus.innerHTML = "Work Session";
          workStatus.style.backgroundColor = "var(--tri2)";
          totalSecond = 25 * 60;
        }
      }, 1000);
    }
  });

  pause.addEventListener("click", function () {
    clearInterval(timerInterval);
  });
  reset.addEventListener("click", function () {
    totalSecond = 25 * 60;
    clearInterval(timerInterval);
    updateTimer();
  });
}
Timer();

let header1H1 = document.querySelector(".header1 h1");
let header1H4 = document.querySelector(".header1 h4");
let header1H2 = document.querySelector(".header1 h2");
function dateTime() {
  let date = null;
  date = new Date();
  const daysofWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let day = daysofWeek[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let tarik = date.getDate();
  let month = monthsOfYear[date.getMonth()];
  let year = date.getFullYear();

  if (hours > 12) {
    header1H1.innerHTML = `${day}, ${String(hours - 12).padStart("2", "0")}:${String(minutes).padStart(
      "2",
      "0"
    )}:${String(seconds).padStart("2", "0")} PM `;
  } else {
    header1H1.innerHTML = `${day}, ${String(hours).padStart("2", "0")}:${String(minutes).padStart(
      "2",
      "0"
    )} AM `;
  }

  header1H2.innerHTML = `${String(tarik).padStart("2", "0")} ${month} , ${year}`;
}

setInterval(() => {
  dateTime();
}, 1000);

let header2H2 = document.querySelector(".header2 h2");
let header2H3 = document.querySelector(".header2 h3");
let header2H4 = document.querySelector(".header2 h4");
let header2H5 = document.querySelector(".header2 h5");
let header2H6 = document.querySelector(".header2 h6");

async function weatherForCast() {
  let APIkey = "8bd081d17292473a857203545250306";
  let city = "Lucknow";
  let response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${city}`
  );

  var weatherdata = await response.json();
  let region = weatherdata.location.region;
  header1H4.innerHTML = `${city}(UP)`;
  console.log(weatherdata);

  let temp = Math.floor(weatherdata.current.temp_c);
  let humidity = weatherdata.current.humidity;
  let winds = weatherdata.current.wind_kph;
  let precipitation = weatherdata.current.precip_mm;
  let text = weatherdata.current.condition.text;
  console.log(weatherdata);

  header2H2.innerHTML = `${temp}°C`;
  header2H4.innerHTML = `${text}`;
  header2H3.innerHTML = `Precipitation: ${precipitation}%`;
  header2H5.innerHTML = `Humidity: ${humidity}%`;
  header2H6.innerHTML = `Wind: ${winds} km/h`;
}
weatherForCast();