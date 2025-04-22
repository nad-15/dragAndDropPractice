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

// Trigger the drag after a long press (300ms)
container.addEventListener('pointerdown', (e) => {
  const target = e.target.closest('.item');
  if (!target) return;

  // Set timeout for long press (300ms)
  dragTimeout = setTimeout(() => {
    startDragging(e, target);
  }, 300);
});

// If the user moves the pointer quickly or lifts the finger, cancel the long press.
container.addEventListener('pointermove', () => {
  clearTimeout(dragTimeout); // cancel if moved
});

// Cancel long press if pointer is released before timeout
container.addEventListener('pointerup', () => {
  clearTimeout(dragTimeout);
});

function startDragging(e, target) {
  draggedItem = target;
  const rect = target.getBoundingClientRect();
  offsetY = e.clientY - rect.top;

  // Create and style the ghost
  ghost = target.cloneNode(true);
  ghost.classList.add('ghost');

  // Copy computed styles
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

  document.body.appendChild(ghost);

  target.classList.add('dragging');
  draggedItem.setPointerCapture(e.pointerId);
}

container.addEventListener('pointermove', (e) => {
  if (!draggedItem || !ghost) return;

  // Move ghost with pointer
  ghost.style.top = `${e.clientY - offsetY}px`;

  const target = document.elementFromPoint(e.clientX, e.clientY);
  const dropTarget = target?.closest('.item');

  if (dropTarget && dropTarget !== draggedItem && container.contains(dropTarget)) {
    const rect = dropTarget.getBoundingClientRect();
    const insertBefore = e.clientY < rect.top + rect.height / 2;
    container.insertBefore(draggedItem, insertBefore ? dropTarget : dropTarget.nextSibling);
  }
});

container.addEventListener('pointerup', () => {
  if (draggedItem) {
    draggedItem.classList.remove('dragging');
    draggedItem = null;
  }
  if (ghost) {
    ghost.remove();
    ghost = null;
  }
});
