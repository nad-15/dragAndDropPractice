// const container = document.getElementById('sortable');
// let draggedItem = null;
// let ghost = null;
// let offsetY = 0;

// container.addEventListener('pointerdown', (e) => {
//   const target = e.target.closest('.item');
//   if (!target) return;

//   draggedItem = target;
//   const rect = target.getBoundingClientRect();
//   offsetY = e.clientY - rect.top;

//   // Create and style ghost
//   ghost = target.cloneNode(true);
//   ghost.classList.add('ghost');

//   // Copy computed styles
//   const computed = getComputedStyle(target);
//   for (let prop of [
//     'width', 'height', 'padding', 'margin',
//     'font', 'fontSize', 'fontWeight',
//     'border', 'borderRadius', 'boxSizing'
//   ]) {
//     ghost.style[prop] = computed[prop];
//   }

//   ghost.style.position = 'absolute';
//   ghost.style.left = `${rect.left}px`;
//   ghost.style.top = `${rect.top}px`;

//   document.body.appendChild(ghost);

//   target.classList.add('dragging');
//   draggedItem.setPointerCapture(e.pointerId);
// });



// container.addEventListener('pointermove', (e) => {
//   if (!draggedItem || !ghost) return;

//   // Move ghost with pointer
//   ghost.style.top = `${e.clientY - offsetY}px`;

//   const target = document.elementFromPoint(e.clientX, e.clientY);
//   const dropTarget = target?.closest('.item');

//   if (dropTarget && dropTarget !== draggedItem && container.contains(dropTarget)) {
//     const rect = dropTarget.getBoundingClientRect();
//     const insertBefore = e.clientY < rect.top + rect.height / 2;
//     container.insertBefore(draggedItem, insertBefore ? dropTarget : dropTarget.nextSibling);
//   }
// });

// container.addEventListener('pointerup', () => {
//   if (draggedItem) {
//     draggedItem.classList.remove('dragging');
//     draggedItem = null;
//   }
//   if (ghost) {
//     ghost.remove();
//     ghost = null;
//   }
// });

const container = document.getElementById('sortable');
let draggedItem = null;
let ghost = null;
let offsetY = 0;
let dragTimeout = null;
let startY = 0;

// Unified drag start logic
function startDragging(x, y, target) {
  draggedItem = target;

  const rect = target.getBoundingClientRect();
  offsetY = y - rect.top;

  ghost = target.cloneNode(true);
  ghost.classList.add('ghost');

  const computed = getComputedStyle(target);
  for (let prop of [
    'width', 'height', 'padding', 'margin',
    'font', 'fontSize', 'fontWeight',
    'border', 'borderRadius', 'boxSizing'
  ]) {
    ghost.style[prop] = computed[prop];
  }

  ghost.style.position = 'absolute';
  ghost.style.left = `${rect.left}px`;
  ghost.style.top = `${rect.top}px`;
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '1000';

  document.body.appendChild(ghost);
  target.classList.add('dragging');
}

function moveGhost(y) {
  if (!ghost) return;
  ghost.style.top = `${y - offsetY}px`;

  const target = document.elementFromPoint(window.innerWidth / 2, y);
  const dropTarget = target?.closest('.item');

  if (dropTarget && dropTarget !== draggedItem && container.contains(dropTarget)) {
    const rect = dropTarget.getBoundingClientRect();
    const insertBefore = y < rect.top + rect.height / 2;
    container.insertBefore(draggedItem, insertBefore ? dropTarget : dropTarget.nextSibling);
  }
}

function endDragging() {
  clearTimeout(dragTimeout);
  if (draggedItem) {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
  }
  if (ghost) {
    ghost.remove();
    ghost = null;
  }
}

// Pointer Events
function handlePointerDown(e) {
  const target = e.target.closest('.item');
  if (!target) return;

  startY = e.clientY;

  dragTimeout = setTimeout(() => {
    startDragging(e.clientX, e.clientY, target);
  }, 300);
}

function handlePointerMove(e) {
  if (Math.abs(e.clientY - startY) > 10) clearTimeout(dragTimeout);
  if (draggedItem) moveGhost(e.clientY);
}

function handlePointerUp() {
  endDragging();
}

// Touch Events (for fallback)
function handleTouchStart(e) {
  const touch = e.touches[0];
  const target = e.target.closest('.item');
  if (!target) return;

  startY = touch.clientY;

  dragTimeout = setTimeout(() => {
    startDragging(touch.clientX, touch.clientY, target);
  }, 300);
}

function handleTouchMove(e) {
  const touch = e.touches[0];
  if (Math.abs(touch.clientY - startY) > 10) clearTimeout(dragTimeout);
  if (draggedItem) {
    moveGhost(touch.clientY);
    e.preventDefault(); // Prevent scrolling
  }
}

function handleTouchEnd() {
  endDragging();
}

// Event Binding
if ('PointerEvent' in window) {
  container.addEventListener('pointerdown', handlePointerDown);
  container.addEventListener('pointermove', handlePointerMove);
  container.addEventListener('pointerup', handlePointerUp);
} else {
  container.addEventListener('touchstart', handleTouchStart, { passive: false });
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('touchend', handleTouchEnd);
}
