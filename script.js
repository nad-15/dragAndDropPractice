let draggedItem = null;
let ghost = null;
let offsetY = 0;
let dragTimeout = null;
let startY = 0;
let animationFrameId = null;
let canStartDrag = false;
let dragTarget = null;
let isTouch = false;

const MAX_DRAG_DISTANCE = 30;

function startDragging(x, y, target) {
  draggedItem = target;

  const rect = target.getBoundingClientRect();
  offsetY = y - rect.top;

  const content = target.querySelector('.event-content');
  if (!content) return;

  ghost = content.cloneNode(true);
  ghost.classList.add('ghost');

  const computed = getComputedStyle(content);
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

  document.body.appendChild(ghost);
  target.classList.add('dragging');
}


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

  const midX = window.innerWidth / 2;
  const target = document.elementFromPoint(midX, y);

  const dropTarget = target?.closest('.event');
  const sectionTarget = target?.closest('.period-section');

  if (dropTarget && dropTarget !== draggedItem) {
    const rect = dropTarget.getBoundingClientRect();
    const insertBefore = y < rect.top + rect.height / 2;
    const parent = dropTarget.parentElement;
    parent.insertBefore(draggedItem, insertBefore ? dropTarget : dropTarget.nextSibling);
  } else if (sectionTarget && !sectionTarget.contains(draggedItem)) {
    sectionTarget.appendChild(draggedItem);
  }
}

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

function handlePointerDown(e) {
  if (isTouch) return;

  const target = e.target.closest('.event');
  if (!target) return;

  startY = e.clientY;
  dragTarget = target;
  canStartDrag = false;

  dragTimeout = setTimeout(() => {
    canStartDrag = true;
  }, 100);
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

function handleTouchStart(e) {
  isTouch = true;
  setTimeout(() => isTouch = false, 1000);

  const touch = e.touches[0];
  const target = e.target.closest('.event');
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
    e.preventDefault(); // prevent scroll
  }
}

function handleTouchEnd() {
  endDragging();
}

// Bind to document for cross-container
document.addEventListener('pointerdown', handlePointerDown);
document.addEventListener('pointermove', handlePointerMove);
document.addEventListener('pointerup', handlePointerUp);
document.addEventListener('pointercancel', endDragging);

document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchmove', handleTouchMove, { passive: false });
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('touchcancel', endDragging);
