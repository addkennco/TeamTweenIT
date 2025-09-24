const canvas = new fabric.Canvas('c');
canvas.setBackgroundColor('lightgrey', canvas.renderAll.bind(canvas));

// --- Helper to restack stickers above everything else ---
function restackStickers() {
  // Bring all non-sticker images (backgrounds) to back first for good measure
  canvas.getObjects().forEach(obj => {
    if (obj.isSticker !== true) {
      canvas.sendToBack(obj);
    }
  });
  // Then bring all stickers to front
  canvas.getObjects().forEach(obj => {
    if (obj.isSticker === true) {
      canvas.bringToFront(obj);
    }
  });
}

// --- Upload image as a regular object (backgrounds/images) ---
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      let scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: true, isSticker: false }); // Tag as not sticker
      canvas.add(img);
      canvas.setActiveObject(img);
      restackStickers();
      canvas.renderAll();
      console.log("Image added as object!", img);
    }, { crossOrigin: 'anonymous' });
  };

  reader.readAsDataURL(file);
});

// --- Double click/single click sticker logic ---
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
    }, 250);
  }
}
window.stickerButtonHandler = stickerButtonHandler;

// --- Add sticker (always bring to front, tag as sticker) ---
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.set({
      left: 50,
      top: 50,
      hasControls: true,
      hasBorders: true,
      selectable: true,
      stickerSrc: src,
      isSticker: true // Tag as sticker
    });
    img.scaleToWidth(100);
    canvas.add(img);
    canvas.setActiveObject(img);
    restackStickers();
    canvas.renderAll();
    console.log("Sticker added!", img);
  }, { crossOrigin: 'anonymous' });
}
window.addSticker = addSticker;

// --- Remove sticker by source ---
function removeSticker(src) {
  const toRemove = canvas.getObjects('image').filter(img => img.stickerSrc === src);
  toRemove.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
  restackStickers();
  console.log("Removed stickers for", src);
}
window.removeSticker = removeSticker;

// --- Undo/redo stacks ---
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

// --- Always restack stickers after any object change ---
canvas.on('object:added', function() { restackStickers(); saveState(); });
canvas.on('object:modified', function() { restackStickers(); saveState(); });
canvas.on('object:removed', function() { restackStickers(); saveState(); });

// --- Also restack after selection events (e.g. user clicks an image) ---
canvas.on('selection:created', restackStickers);
canvas.on('selection:updated', restackStickers);

// --- Undo/redo functions, restack after restoring ---
function undo() {
  if (undoStack.length > 1) {
    isRestoring = true;
    redoStack.push(undoStack.pop());
    canvas.loadFromJSON(undoStack[undoStack.length - 1], () => {
      canvas.renderAll();
      restackStickers();
      isRestoring = false;
    });
  }
}
window.undo = undo;

function redo() {
  if (redoStack.length > 0) {
    isRestoring = true;
    const state = redoStack.pop();
    undoStack.push(state);
    canvas.loadFromJSON(state, () => {
      canvas.renderAll();
      restackStickers();
      isRestoring = false;
    });
  }
}
window.redo = redo;

// --- On initial load, save the empty canvas state ---
saveState();

// --- Download ---
function downloadImage() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final.png';
  link.click();
}
window.downloadImage = downloadImage;
