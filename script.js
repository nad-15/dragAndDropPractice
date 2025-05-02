// Get elements with vert-view naming
const calendarContainerVertView = document.getElementById("calendar-container-vert-view");
const showCalendarBtnVertView = document.getElementById("show-vert-calendar-btn");
const daysGridVertView = document.getElementById("days-grid-vert-view");
const monthLabelVertView = document.getElementById("month-label-vert-view");
const prevMonthBtnVertView = document.getElementById("prev-month-vert-view");
const nextMonthBtnVertView = document.getElementById("next-month-vert-view");

// Get current date in Toronto timezone
let todayVertView = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' }));
let currentMonthVertView = todayVertView.getMonth();
let currentYearVertView = todayVertView.getFullYear();

// Toggle calendar visibility
showCalendarBtnVertView.addEventListener("click", () => {
  calendarContainerVertView.style.display = calendarContainerVertView.style.display === "flex" ? "none" : "flex";
});

// Update calendar grid
function updateCalendarVertView(month, year) {
    daysGridVertView.innerHTML = "";
  
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
  updateCalendarVertView(currentMonthVertView, currentYearVertView);
});

nextMonthBtnVertView.addEventListener("click", () => {
  currentMonthVertView++;
  if (currentMonthVertView > 11) {
    currentMonthVertView = 0;
    currentYearVertView++;
  }
  updateCalendarVertView(currentMonthVertView, currentYearVertView);
});

// Initial render
updateCalendarVertView(currentMonthVertView, currentYearVertView);
