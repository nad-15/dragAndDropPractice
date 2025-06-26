const container = document.getElementById('sortable');

let draggedItem = null;
let ghost = null;
let offsetY = 0;
let dragTimeout = null;
let startY = 0;
let isTouch = false;
let animationFrameId = null;
let canStartDrag = false;
let dragTarget = null;

const MAX_DRAG_DISTANCE = 30; // Maximum movement allowed before canceling drag

// Start dragging
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

// Smooth ghost movement
function moveGhostThrottled(y) {
  if (animationFrameId) return;
  animationFrameId = requestAnimationFrame(() => {
    moveGhost(y);
    animationFrameId = null;
  });
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

// Stop drag
function endDragging() {
  if (dragTimeout) {
    clearTimeout(dragTimeout);
    dragTimeout = null;
  }

  canStartDrag = false;
  dragTarget = null;

  if (draggedItem) {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
  }

  if (ghost) {
    try {
      ghost.remove();
    } catch {}
    ghost = null;
  }
}

// Pointer Events
function handlePointerDown(e) {
  if (isTouch) return;

  const target = e.target.closest('.item');
  if (!target) return;

  startY = e.clientY;
  dragTarget = target;
  canStartDrag = false;

  dragTimeout = setTimeout(() => {
    canStartDrag = true;
  }, 300);
}

function handlePointerMove(e) {
  const distance = Math.abs(e.clientY - startY);

  if (dragTimeout && distance > MAX_DRAG_DISTANCE) {
    clearTimeout(dragTimeout);
    dragTimeout = null;
    dragTarget = null;
    canStartDrag = false;
  }

  if (!draggedItem && canStartDrag && dragTarget) {
    startDragging(e.clientX, e.clientY, dragTarget);
  }

  if (draggedItem) moveGhostThrottled(e.clientY);
}

function handlePointerUp() {
  endDragging();
}

// Touch Events
function handleTouchStart(e) {
  isTouch = true;
  setTimeout(() => isTouch = false, 1000);

  const touch = e.touches[0];
  const target = e.target.closest('.item');
  if (!target) return;

  startY = touch.clientY;
  dragTarget = target;
  canStartDrag = false;

  dragTimeout = setTimeout(() => {
    canStartDrag = true;
  }, 300);
}

function handleTouchMove(e) {
  const touch = e.touches[0];
  const distance = Math.abs(touch.clientY - startY);

  if (dragTimeout && distance > MAX_DRAG_DISTANCE) {
    clearTimeout(dragTimeout);
    dragTimeout = null;
    dragTarget = null;
    canStartDrag = false;
  }

  if (!draggedItem && canStartDrag && dragTarget) {
    startDragging(touch.clientX, touch.clientY, dragTarget);
  }

  if (draggedItem) {
    moveGhostThrottled(touch.clientY);
    e.preventDefault(); // Prevent page scroll
  }
}

function handleTouchEnd() {
  endDragging();
}

// Prevent default browser drag behavior
document.addEventListener('dragstart', e => e.preventDefault());

// Bind events
container.addEventListener('pointerdown', handlePointerDown);
container.addEventListener('pointermove', handlePointerMove);
container.addEventListener('pointerup', handlePointerUp);
container.addEventListener('pointercancel', endDragging);

container.addEventListener('touchstart', handleTouchStart, { passive: false });
container.addEventListener('touchmove', handleTouchMove, { passive: false });
container.addEventListener('touchend', handleTouchEnd);
container.addEventListener('touchcancel', endDragging);
