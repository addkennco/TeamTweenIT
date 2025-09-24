const canvas = new fabric.Canvas('c');

// Optionally set a background color to verify rendering
canvas.setBackgroundColor('lightgrey', canvas.renderAll.bind(canvas));

// upload image as a regular object
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // Scale proportionally to fit canvas
      let scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: true });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      console.log("Image added as object!", img);
      console.log("Canvas objects:", canvas.getObjects());
    }, { crossOrigin: 'anonymous' });
  };

  reader.readAsDataURL(file);
});

// click timer because it keeps reading double clicks as single clicks
let clickTimer = null;
function stickerButtonHandler(src) {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
    removeSticker(src); // Double-click detected
  } else {
    clickTimer = setTimeout(() => {
      addSticker(src);
      clickTimer = null;
    }, 250); // 250ms: typical double-click gap
  }
}
window.stickerButtonHandler = stickerButtonHandler;

// add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.set({
      left: 50,
      top: 50,
      hasControls: true,
      hasBorders: true,
      selectable: true,
      stickerSrc: src // <--- custom tag!
    });
    img.scaleToWidth(100);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
    console.log("Sticker added!", img);
  }, { crossOrigin: 'anonymous' });
}
window.addSticker = addSticker;

// remove sticker
function removeSticker(src) {
  const toRemove = canvas.getObjects('image').filter(img => img.stickerSrc === src);
  toRemove.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
  console.log("Removed stickers for", src);
}
window.removeSticker = removeSticker;

// Undo/redo stacks
let undoStack = [];
let redoStack = [];
const maxHistory = 25; // Limit history for memory

// Save state to undo stack (call this after any change)
function saveState() {
  // Clear redo stack on new action
  redoStack = [];
  // Push current state
  undoStack.push(canvas.toDatalessJSON());
  if (undoStack.length > maxHistory) undoStack.shift();
}

// Call saveState after every add/remove/move/scale/rotate
canvas.on('object:added', saveState);
canvas.on('object:modified', saveState);
canvas.on('object:removed', saveState);

// Undo function
function undo() {
  if (undoStack.length > 1) {
    // Move current state to redo stack
    redoStack.push(undoStack.pop());
    canvas.loadFromJSON(undoStack[undoStack.length - 1], () => {
      canvas.renderAll();
    });
  }
}

// Redo function
function redo() {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
    });
  }
}

// On initial load, save the empty canvas state
saveState();

// download final image
function downloadImage() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final.png';
  link.click();
}
window.downloadImage = downloadImage;
