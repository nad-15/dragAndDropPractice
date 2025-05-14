// === SETUP DOM ELEMENTS ===
const calendarContainerVertView = document.getElementById("calendar-container-vert-view");
const showCalendarBtnVertView = document.getElementById("show-vert-calendar-btn");
const daysGridVertView = document.getElementById("days-grid-vert-view");
const monthLabelVertView = document.getElementById("month-label-vert-view");
const prevMonthBtnVertView = document.getElementById("prev-month-vert-view");
const nextMonthBtnVertView = document.getElementById("next-month-vert-view");






// === RESIZE THE CALENDAR VIEW MINUS THE ADDRESS BAR ===
function adjustCalendarHeight() {
  calendarContainerVertView.style.height = `${window.innerHeight}px`;

  // Adjust popup max-height as well
  const popup = document.getElementById("calendar-pop-up");
  if (popup) {
    popup.style.maxHeight = `${window.innerHeight * 0.8}px`;
    popup.style.height = `${window.innerHeight * 0.8}px`;
  }
}


// Call initially and on resize
adjustCalendarHeight();
window.addEventListener('resize', adjustCalendarHeight);



// === TIME VARIABLES ===
let todayVertView = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
let currentMonthVertView = todayVertView.getMonth();
let currentYearVertView = todayVertView.getFullYear();

// === TOGGLE CALENDAR ===
showCalendarBtnVertView.addEventListener("click", () => {
  calendarContainerVertView.style.display = calendarContainerVertView.style.display === "flex" ? "none" : "flex";
});

// === LOAD TASKS ===
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  return tasks || {};
}

function createCalendarGrid() {
  daysGridVertView.innerHTML = "";

  for (let i = 0; i < 42; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-vert-view");
    dayCell.addEventListener(`click`, showDayTasks);

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");

    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container-vert-view");

    dayCell.appendChild(dayNumber);
    dayCell.appendChild(taskContainer);
    daysGridVertView.appendChild(dayCell);
  }
  // === SHOW POP UP FOR THE DAY ===
  function showDayTasks(e) {
    const dayElement = e.target.closest('.day-vert-view');
    const date = dayElement.dataset.fullDate;

    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || {};
    const dayTasks = storedTasks[date];

    const dateObj = new Date(date);
    dateObj.setMonth(dateObj.getMonth() + 1); // If needed

    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
    const rest = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

document.getElementById("popup-date").innerHTML = `
  <div class="weekday">${weekday}</div>
  <div class="month-year">${rest}</div>
`;



    const popupTasks = document.getElementById("popup-tasks");
    popupTasks.innerHTML = "";

    if (!dayTasks) {
      const noTask = document.createElement("p");
      noTask.textContent = "No tasks for this day.";
      popupTasks.appendChild(noTask);
    } else {
      const periods = ["morning", "afternoon", "evening"];

      periods.forEach(period => {
        const section = document.createElement("div");
        section.classList.add("period-section");

        // const heading = document.createElement("h3");
        // heading.textContent = period.charAt(0).toUpperCase() + period.slice(1);
        // section.appendChild(heading);

        // const dashedLine = document.createElement("hr");
        // dashedLine.classList.add("dashed-line");
        // section.appendChild(dashedLine);

        const divider = document.createElement("div");
        divider.className = "section-divider";
        divider.textContent = period.charAt(0).toUpperCase() + period.slice(1);
        section.appendChild(divider);


        const periodTasks = dayTasks[period];
        if (periodTasks && periodTasks.length > 0) {
          periodTasks.forEach(({ task, color }) => {
            const eventDiv = document.createElement("div");
            eventDiv.className = "event";

            const content = document.createElement("div");
            content.className = "event-content";

            const title = document.createElement("span");
            title.className = "event-title";

            const hasText = task && task.trim() !== "";
            const hasColor = color && color.trim() !== "";

            if (hasText && hasColor) {
              content.style.borderLeft = `5px solid ${color}`;
              title.textContent = task;
            } else if (!hasText && hasColor) {
              content.style.borderLeft = `5px solid ${color}`;
              title.textContent = "No Title";
            } else {
              // No text and no color
              content.style.borderLeft = "none";
              title.textContent = "No Task";
            }

            content.appendChild(title);
            eventDiv.appendChild(content);
            section.appendChild(eventDiv);
          });
        }
        else {
          const noTask = document.createElement("p");
          noTask.className = "no-tasks-text";
          noTask.textContent = "No tasks for this period.";
          section.appendChild(noTask);
        }

        popupTasks.appendChild(section);
      });
    }

    document.getElementById("calendar-pop-up").style.display = "block";
    document.getElementById("backdrop").style.display = "block";
  }





  // === CLOSE FUNCITONALITY FOR POP UP
  document.getElementById("closePopupBtn").addEventListener("click", () => {
    document.getElementById("calendar-pop-up").style.display = "none";
    document.getElementById("backdrop").style.display = "none";
  });

  document.getElementById("backdrop").addEventListener("click", () => {
    document.getElementById("calendar-pop-up").style.display = "none";
    document.getElementById("backdrop").style.display = "none";
  });


  // === SET MAX HEIGHT for each task container after DOM elements are in place
  const allDayCells = daysGridVertView.querySelectorAll(".day-vert-view");
  allDayCells.forEach(cell => {
    const dayNumber = cell.querySelector(".day-number");
    const taskContainer = cell.querySelector(".task-container-vert-view");

    const cellHeight = cell.clientHeight;
    const dayNumberHeight = dayNumber.offsetHeight;

    const marginTop = 4; // matches CSS: margin-top: 4px
    const availableHeight = cellHeight - dayNumberHeight - marginTop;

    taskContainer.style.maxHeight = `${availableHeight}px`;
  });
}

function updateCalendarWithTasks(month, year) {
  const tasks = loadTasksFromLocalStorage();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysLastMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthLabelVertView.textContent = `${monthNames[month]} ${year}`;

  const dayCells = daysGridVertView.children;

  for (let i = 0; i < 42; i++) {
    const cell = dayCells[i];
    const dayNumber = cell.querySelector(".day-number");
    const taskContainer = cell.querySelector(".task-container-vert-view");

    cell.classList.remove("adjacent-month-vert-view", "today-vert-view");
    taskContainer.innerHTML = "";

    let currentDay, dateKey;

    // === PREVIOUS MONTH ===
    if (i < firstDayOfMonth) {
      currentDay = totalDaysLastMonth - firstDayOfMonth + 1 + i;
      dayNumber.textContent = currentDay;
      cell.classList.add("adjacent-month-vert-view");

      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      dateKey = `${prevYear}-${prevMonth}-${currentDay}`;
      cell.setAttribute("data-full-date", dateKey);

    }

    // === CURRENT MONTH ===
    else if (i < firstDayOfMonth + totalDaysInMonth) {
      currentDay = i - firstDayOfMonth + 1;
      dayNumber.textContent = currentDay;
      dateKey = `${year}-${month}-${currentDay}`;
      cell.setAttribute("data-full-date", dateKey);


      // Restore the "today" highlight
      if (
        currentDay === todayVertView.getDate() &&
        month === todayVertView.getMonth() &&
        year === todayVertView.getFullYear()
      ) {
        cell.classList.add("today-vert-view");
      }
    }

    // === NEXT MONTH ===
    else {
      currentDay = i - (firstDayOfMonth + totalDaysInMonth) + 1;
      dayNumber.textContent = currentDay;
      cell.classList.add("adjacent-month-vert-view");

      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      dateKey = `${nextYear}-${nextMonth}-${currentDay}`;
      cell.setAttribute("data-full-date", dateKey);

    }

    // === TASK INJECTION (for all dates) ===
    const dayTasks = tasks[dateKey];
    if (dayTasks) {
      ['morning', 'afternoon', 'evening'].forEach(period => {
        if (Array.isArray(dayTasks[period])) {
          dayTasks[period].forEach(task => {
            if (task.color) {
              const taskDiv = document.createElement("div");
              taskDiv.classList.add(`task-${period}`);
              taskDiv.style.borderLeft = `3px solid ${task.color}`;
              taskDiv.style.backgroundColor = fadeColor(task.color);
              taskDiv.textContent = task.task || "";
              taskContainer.appendChild(taskDiv);
            }
          });
        }
      });
    }
  }
}



// === REMOVE THIS HELPER FUNCTION ONCE PUT IN SHCEDULER ===
function fadeColor(color, alpha = 0.6) {
  // If color is in rgb format, return it with the alpha applied
  if (color.startsWith('rgb')) {
    return color.replace(')', `, ${alpha})`).replace('rgba', 'rgb');
  }

  // Otherwise, treat it as a hex color and convert to rgba
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}


// === NAVIGATION ===
prevMonthBtnVertView.addEventListener("click", () => {
  currentMonthVertView--;
  if (currentMonthVertView < 0) {
    currentMonthVertView = 11;
    currentYearVertView--;
  }
  updateCalendarWithTasks(currentMonthVertView, currentYearVertView);
});

nextMonthBtnVertView.addEventListener("click", () => {
  currentMonthVertView++;
  if (currentMonthVertView > 11) {
    currentMonthVertView = 0;
    currentYearVertView++;
  }
  updateCalendarWithTasks(currentMonthVertView, currentYearVertView);
});



// === INITIAL SETUP ===
createCalendarGrid();
updateCalendarWithTasks(currentMonthVertView, currentYearVertView);
