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

// undo and redo
let undoStack = [];
let redoStack = [];
const maxHistory = 25;
let isRestoring = false;

function saveState() {
  if (isRestoring) return;
  redoStack = [];
  undoStack.push(canvas.toDatalessJSON());
  if (undoStack.length > maxHistory) undoStack.shift();
}

canvas.on('object:added', saveState);
canvas.on('object:modified', saveState);
canvas.on('object:removed', saveState);

function undo() {
  if (undoStack.length > 1) {
    isRestoring = true;
    redoStack.push(undoStack.pop());
    canvas.loadFromJSON(undoStack[undoStack.length - 1], () => {
      canvas.renderAll();
      isRestoring = false;
    });
  }
}

function redo() {
  if (redoStack.length > 0) {
    isRestoring = true;
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      isRestoring = false;
    });
  }
}

saveState(); // on initial load

// download final image
function downloadImage() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final.png';
  link.click();
}
window.downloadImage = downloadImage;
