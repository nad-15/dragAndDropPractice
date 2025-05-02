// Get elements with vert-view naming
const calendarContainerVertView = document.getElementById("calendar-container-vert-view");
const showCalendarBtnVertView = document.getElementById("show-vert-calendar-btn");
const daysGridVertView = document.getElementById("days-grid-vert-view");
const monthLabelVertView = document.getElementById("month-label-vert-view");
const prevMonthBtnVertView = document.getElementById("prev-month-vert-view");
const nextMonthBtnVertView = document.getElementById("next-month-vert-view");

// Example task data for May 1st to May 5th
const taskData = {
    "2025-5-1": {
      morning: [{ task: "Morning Task 1", color: "rgb(106, 80, 68)" }],
      afternoon: [{ task: "Afternoon Task 1", color: "rgb(209, 199, 189)" }],
      evening: [{ task: "Evening Task 1", color: "#dfb2f4" }]
    },
    "2025-5-2": {
      morning: [{ task: "Morning Task 2", color: "rgb(106, 80, 68)" }],
      afternoon: [{ task: "Afternoon Task 2", color: "rgb(209, 199, 189)" }],
      evening: [{ task: "Evening Task 2", color: "#dfb2f4" }]
    },
    "2025-5-3": {
      morning: [{ task: "Morning Task 3", color: "rgb(106, 80, 68)" }],
      afternoon: [{ task: "Afternoon Task 3", color: "rgb(209, 199, 189)" }],
      evening: [{ task: "Evening Task 3", color: "#dfb2f4" }]
    },
    "2025-5-4": {
      morning: [{ task: "Morning Task 4", color: "rgb(106, 80, 68)" }],
      afternoon: [{ task: "Afternoon Task 4", color: "rgb(209, 199, 189)" }],
      evening: [{ task: "Evening Task 4", color: "#dfb2f4" }]
    },
    "2025-5-5": {
      morning: [{ task: "Morning Task 5", color: "rgb(106, 80, 68)" }],
      afternoon: [{ task: "Afternoon Task 5", color: "rgb(209, 199, 189)" }],
      evening: [{ task: "Evening Task 5", color: "#dfb2f4" }]
    }
  };
  
  // Set tasks to localStorage
  localStorage.setItem("tasks", JSON.stringify(taskData));
  

  

// Get current date in Toronto timezone
let todayVertView = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
let currentMonthVertView = todayVertView.getMonth();
let currentYearVertView = todayVertView.getFullYear();

// Toggle calendar visibility
showCalendarBtnVertView.addEventListener("click", () => {
  calendarContainerVertView.style.display = calendarContainerVertView.style.display === "flex" ? "none" : "flex";
});

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  return tasks || {}; // Return tasks or an empty object if nothing exists
}

// Update calendar grid with tasks
function updateCalendarWithTasks(month, year) {
  daysGridVertView.innerHTML = ""; // Clear existing days

  const tasks = loadTasksFromLocalStorage(); // Get the tasks
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysLastMonth = new Date(year, month, 0).getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthLabelVertView.textContent = `${monthNames[month]} ${year}`;

  const totalCells = 42; // 6 rows * 7 days

  for (let i = 0; i < totalCells; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-vert-view");

    // Previous month's tail
    if (i < firstDayOfMonth) {
      const dayNum = totalDaysLastMonth - firstDayOfMonth + 1 + i;
      dayCell.textContent = dayNum;
      dayCell.classList.add("adjacent-month-vert-view");
    }
    // Current month
    else if (i < firstDayOfMonth + totalDaysInMonth) {
      const currentDay = i - firstDayOfMonth + 1;
      dayCell.textContent = currentDay;

      // Check if this day has any tasks
      const dayTasks = tasks[`${year}-${month + 1}-${currentDay}`];
      if (dayTasks) {
        // Populate the day with tasks if available
        dayCell.innerHTML = `
          <div class="task-morning" style="background-color:${dayTasks.morning[0]?.color}">
            ${dayTasks.morning[0]?.task || ''}
          </div>
          <div class="task-afternoon" style="background-color:${dayTasks.afternoon[0]?.color}">
            ${dayTasks.afternoon[0]?.task || ''}
          </div>
          <div class="task-evening" style="background-color:${dayTasks.evening[0]?.color}">
            ${dayTasks.evening[0]?.task || ''}
          </div>
        `;
      }

      // Highlight today
      if (
        currentDay === todayVertView.getDate() &&
        month === todayVertView.getMonth() &&
        year === todayVertView.getFullYear()
      ) {
        dayCell.classList.add("today-vert-view");
      }
    }
    // Next month's head
    else {
      const dayNum = i - (firstDayOfMonth + totalDaysInMonth) + 1;
      dayCell.textContent = dayNum;
      dayCell.classList.add("adjacent-month-vert-view");
    }

    daysGridVertView.appendChild(dayCell);
  }
}

// Navigation buttons
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

// Initial render
updateCalendarWithTasks(currentMonthVertView, currentYearVertView);
