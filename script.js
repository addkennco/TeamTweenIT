const canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});
canvas.setBackgroundColor('lightgrey', canvas.renderAll.bind(canvas));

// --- Helper to restack stickers above everything else ---
function restackStickers() {
   // Get all objects
  const objs = canvas.getObjects();

  // Move all uploads (not stickers) to the back
  objs.forEach(obj => {
    if (!obj.isSticker) { // Make sure you set this property when adding!
      canvas.sendToBack(obj);
    }
  });

  // Move all stickers to the front
  objs.forEach(obj => {
    if (obj.isSticker) {
      canvas.bringToFront(obj);
    }
  });

  canvas.renderAll();
}

// --- Upload image as a regular object (backgrounds/images) ---
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: true,  hasControls: true, isSticker: false });

      // --- Delete Control ---
      img.setControlsVisibility({
        mt: false, mb: false, ml: false, mr: false,
        bl: false, br: false, tl: false, tr: true
      });
      img.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetX: 16,
        offsetY: -16,
        cursorStyle: 'pointer',
        mouseUpHandler: function(eventData, transform) {
          const obj = transform.target;
          canvas.remove(obj);
          canvas.renderAll();
          saveState();
        },
        render: function(ctx, left, top, styleOverride, fabricObject) {
          fabric.Control.prototype.render.call(this, ctx, left, top, styleOverride, fabricObject);
          ctx.fillStyle = 'black';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('\u2717', left, top);
        }
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      restackStickers();
    }, { crossOrigin: 'anonymous' });

    // **Clear the file input so same file can be uploaded again**
    e.target.value = '';
  };

  reader.readAsDataURL(file);
});

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
      isSticker: true
    });
    img.scaleToWidth(100);

  // --- Delete control ---
  img.controls.tr = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetX: 16,
  offsetY: -16,
  cursorStyle: 'pointer',
  mouseUpHandler: function(eventData, transform) {
    const obj = transform.target;
    canvas.remove(obj);
    canvas.renderAll();
    saveState();
  },
  render: function(ctx, left, top, styleOverride, fabricObject) {
    // draw the default control box
    fabric.Control.prototype.render.call(this, ctx, left, top, styleOverride, fabricObject);

    // add a unicode "×" in the middle
    ctx.fillStyle = 'black';      // color of the X
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('\u2717', left, top);
  }
});
    
    canvas.add(img);
    canvas.setActiveObject(img);
    restackStickers();
  }, { crossOrigin: 'anonymous' });
}
window.addSticker = addSticker;

// --- Remove sticker by source ---
function removeSticker(src) {
  const toRemove = canvas.getObjects('image').filter(img => img.stickerSrc === src);
  toRemove.forEach(obj => canvas.remove(obj));
  restackStickers();
  console.log("Removed stickers for", src);
}
window.removeSticker = removeSticker;

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

// --- Always restack stickers after any object change, and save state ---
canvas.on('object:added', function() {
  if (isRestoring) return;        // Don’t save while restoring
  setTimeout(() => { restackStickers(); saveState(); }, 0);
});

canvas.on('object:modified', function() {
  if (isRestoring) return;
  setTimeout(() => { restackStickers(); saveState(); }, 0);
});

canvas.on('object:removed', function() {
  if (isRestoring) return;
  setTimeout(() => { restackStickers(); saveState(); }, 0);
});

// --- Undo/redo functions, restack after restoring ---
function undo() {
  if (undoStack.length > 1) {
    isRestoring = true;
    redoStack.push(undoStack.pop());
    canvas.loadFromJSON(undoStack[undoStack.length - 1], () => {
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
      restackStickers();
      isRestoring = false;
    });
  }
}
window.redo = redo;

// --- On initial load, save the empty canvas state ---
saveState();

// --- Download ---
function download() {
  canvas.discardActiveObject();
  canvas.renderAll();

  // create dataURL (will throw if canvas is tainted)
  const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });

  // create and click a temp anchor
  const a = document.createElement('a');
  a.href = dataURL.replace('image/png', 'image/octet-stream');
  a.download = 'final.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
