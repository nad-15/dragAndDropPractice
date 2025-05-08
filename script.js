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

// === CREATE FIXED 42 CELLS ===
function createCalendarGrid() {
  daysGridVertView.innerHTML = "";
  for (let i = 0; i < 42; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-vert-view");

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");
    
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("task-container-vert-view");

    dayCell.appendChild(dayNumber);
    dayCell.appendChild(taskContainer);
    daysGridVertView.appendChild(dayCell);
  }
}

// === UPDATE DAY CELLS ===
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

    if (i < firstDayOfMonth) {
      currentDay = totalDaysLastMonth - firstDayOfMonth + 1 + i;
      dayNumber.textContent = currentDay;
      cell.classList.add("adjacent-month-vert-view");
    } else if (i < firstDayOfMonth + totalDaysInMonth) {
      currentDay = i - firstDayOfMonth + 1;
      dayNumber.textContent = currentDay;
      dateKey = `${year}-${month}-${currentDay}`;

      const dayTasks = tasks[dateKey];
      if (dayTasks) {
        ['morning', 'afternoon', 'evening'].forEach(period => {
          if (Array.isArray(dayTasks[period])) {
            dayTasks[period].forEach(task => {
              if (task.color) {
                const taskDiv = document.createElement("div");
                taskDiv.classList.add(`task-${period}`);
                // taskDiv.style.backgroundColor = task.color;
                taskDiv.style.borderLeft = `3px solid ${task.color}`;
                taskDiv.style.backgroundColor = fadeColor(task.color); 
                taskDiv.textContent = task.task || ""; // If task text is missing, leave blank
                taskContainer.appendChild(taskDiv);
              }
            });
          }
        });
      }
      

      if (
        currentDay === todayVertView.getDate() &&
        month === todayVertView.getMonth() &&
        year === todayVertView.getFullYear()
      ) {
        cell.classList.add("today-vert-view");
      }
    } else {
      currentDay = i - (firstDayOfMonth + totalDaysInMonth) + 1;
      dayNumber.textContent = currentDay;
      cell.classList.add("adjacent-month-vert-view");
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

// // === ADJUST GRID HEIGHT BASED ON SCREEN SIZE ===
// function adjustGridHeight() {
//   const headerHeight = document.querySelector('.calendar-header-vert-view').offsetHeight;
//   const calendarContainerHeight = calendarContainerVertView.offsetHeight;
  
//   // Calculate remaining height after subtracting the header and other elements
//   const remainingHeight = calendarContainerHeight - headerHeight;

//   // Calculate the height of each row by dividing the remaining height by 6
//   const rowHeight = remainingHeight / 6;

//   // Apply the calculated height to each day cell
//   const dayCells = daysGridVertView.children;
//   for (let i = 0; i < dayCells.length; i++) {
//     dayCells[i].style.height = `${rowHeight}px`;
//   }
// }

// // Call the function to adjust grid height initially and when the window is resized
// adjustGridHeight();
// window.addEventListener('resize', adjustGridHeight);

// === INITIAL SETUP ===
createCalendarGrid();
updateCalendarWithTasks(currentMonthVertView, currentYearVertView);
