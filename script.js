// Get elements with vert-view naming
const calendarContainerVertView = document.getElementById("calendar-container-vert-view");
const showCalendarBtnVertView = document.getElementById("show-vert-calendar-btn");
const daysGridVertView = document.getElementById("days-grid-vert-view");
const monthLabelVertView = document.getElementById("month-label-vert-view");
const prevMonthBtnVertView = document.getElementById("prev-month-vert-view");
const nextMonthBtnVertView = document.getElementById("next-month-vert-view");
const taskData = {
  "2025-5-1": {
    morning: [
      { task: "Wake up early", color: "#D7263D" },
      { task: "Stretching", color: "#F46036" },
      { task: "Meditate", color: "#2E294E" },
      { task: "Write journal", color: "#1B998B" },
      { task: "Read 10 pages", color: "#C5D86D" },
      { task: "Plan the day", color: "#6A0572" },
      { task: "Make coffee", color: "#9A031E" },
      { task: "Quick email check", color: "#FFBA08" },
      { task: "Shower", color: "#3A0CA3" },
      { task: "Morning walk", color: "#4361EE" }
    ],
    afternoon: [
      { task: "Lunch", color: "#F72585" },
      { task: "Team meeting", color: "#7209B7" },
      { task: "Work on project", color: "#4CC9F0" },
      { task: "Check tasks", color: "#4895EF" }
    ],
    evening: [
      { task: "Cook dinner", color: "#5603AD" },
      { task: "Family time", color: "#8E7DBE" },
      { task: "Watch a movie", color: "#FFC300" },
      { task: "Sleep prep", color: "#3A86FF" }
    ]
  },

  "2025-5-2": {
    morning: [
      { task: "Review notes", color: "#E63946" },
      { task: "Gym workout", color: "#F1FAEE" },
      { task: "Protein shake", color: "#A8DADC" },
      { task: "Grocery list", color: "#457B9D" },
      { task: "Study 1 hour", color: "#1D3557" },
      { task: "Call parents", color: "#FF006E" },
      { task: "Walk dog", color: "#FB5607" },
      { task: "Email response", color: "#FFBE0B" },
      { task: "Do laundry", color: "#8338EC" },
      { task: "Iron clothes", color: "#3A0CA3" }
    ],
    afternoon: [
      { task: "Client call", color: "#FFB703" },
      { task: "Check invoices", color: "#FB8500" },
      { task: "Budget planning", color: "#023047" }
    ],
    evening: [
      { task: "Gaming", color: "#00BBF9" },
      { task: "Online course", color: "#3A86FF" },
      { task: "Wind down", color: "#8338EC" }
    ]
  },

  "2025-5-3": {
    morning: [
      { task: "Meditate", color: "#3D348B" },
      { task: "Check bank", color: "#7678ED" },
      { task: "Make bed", color: "#F7B801" },
      { task: "Clean kitchen", color: "#F18701" },
      { task: "Podcast listen", color: "#F35B04" },
      { task: "Design UI", color: "#227C9D" },
      { task: "Code review", color: "#17C3B2" },
      { task: "Check PRs", color: "#FE6D73" },
      { task: "Plan grocery", color: "#FFD166" },
      { task: "Prep notes", color: "#06D6A0" }
    ],
    afternoon: [
      { task: "Laundry round 2", color: "#118AB2" },
      { task: "Fix bike", color: "#EF476F" }
    ],
    evening: [
      { task: "Dinner out", color: "#06D6A0" },
      { task: "Social call", color: "#F4A261" }
    ]
  },

  "2025-5-4": {
    morning: [
      { task: "Sun salutation", color: "#A2D2FF" },
      { task: "Coffee with toast", color: "#FFAFCC" },
      { task: "Sketch ideas", color: "#BDB2FF" },
      { task: "Write blog post", color: "#FFC8DD" },
      { task: "Test app", color: "#CDB4DB" },
      { task: "Push to Git", color: "#FFFFFC" },
      { task: "Quick sprint", color: "#EDF6F9" },
      { task: "Clean workspace", color: "#006D77" },
      { task: "Update resume", color: "#E29578" },
      { task: "Read article", color: "#FFDDD2" }
    ],
    afternoon: [
      { task: "Mini hike", color: "#83C5BE" },
      { task: "Take pictures", color: "#EDF6F9" }
    ],
    evening: [
      { task: "Dinner and wine", color: "#FFB5A7" },
      { task: "Paint", color: "#FCD5CE" }
    ]
  },

  "2025-5-5": {
    morning: [
      { task: "Early workout", color: "#FDE2E4" },
      { task: "Protein smoothie", color: "#FAD2E1" },
      { task: "Light stretch", color: "#E2ECE9" },
      { task: "To-do list", color: "#D3E4CD" },
      { task: "Morning call", color: "#99C1B9" },
      { task: "Mindfulness", color: "#70A9A1" },
      { task: "Email sort", color: "#40798C" },
      { task: "Tidy bed", color: "#1F363D" },
      { task: "Goal check", color: "#FFE156" },
      { task: "Yoga", color: "#6A0572" }
    ],
    afternoon: [
      { task: "Sketch prototype", color: "#AB83A1" },
      { task: "Team sync", color: "#3D5A80" }
    ],
    evening: [
      { task: "Video call", color: "#98C1D9" },
      { task: "Cook & relax", color: "#EE6C4D" }
    ]
  }
};

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
  return tasks || {};
}

function updateCalendarWithTasks(month, year) {
  daysGridVertView.innerHTML = "";

  const tasks = loadTasksFromLocalStorage();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysLastMonth = new Date(year, month, 0).getDate();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  monthLabelVertView.textContent = `${monthNames[month]} ${year}`;

  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-vert-view");

    if (i < firstDayOfMonth) {
      const dayNum = totalDaysLastMonth - firstDayOfMonth + 1 + i;
      dayCell.textContent = dayNum;
      dayCell.classList.add("adjacent-month-vert-view");
    } else if (i < firstDayOfMonth + totalDaysInMonth) {
      const currentDay = i - firstDayOfMonth + 1;
      const dateKey = `${year}-${month + 1}-${currentDay}`;

      const dayNumber = document.createElement("div");
      dayNumber.textContent = currentDay;

      const taskContainer = document.createElement("div");
      taskContainer.classList.add("task-container-vert-view");

      const dayTasks = tasks[dateKey];
      if (dayTasks) {
        if (Array.isArray(dayTasks.morning)) {
          dayTasks.morning.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-morning");
            taskDiv.style.backgroundColor = task.color;
            taskDiv.textContent = task.task;
            taskContainer.appendChild(taskDiv);
          });
        }

        if (Array.isArray(dayTasks.afternoon)) {
          dayTasks.afternoon.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-afternoon");
            taskDiv.style.backgroundColor = task.color;
            taskDiv.textContent = task.task;
            taskContainer.appendChild(taskDiv);
          });
        }

        if (Array.isArray(dayTasks.evening)) {
          dayTasks.evening.forEach(task => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task-evening");
            taskDiv.style.backgroundColor = task.color;
            taskDiv.textContent = task.task;
            taskContainer.appendChild(taskDiv);
          });
        }
      }

      dayCell.appendChild(dayNumber);
      dayCell.appendChild(taskContainer);

      if (
        currentDay === todayVertView.getDate() &&
        month === todayVertView.getMonth() &&
        year === todayVertView.getFullYear()
      ) {
        dayCell.classList.add("today-vert-view");
      }
    } else {
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
