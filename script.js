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

fabric.Object.prototype.toObject = (function(toObject) {
  return function(properties) {
    return toObject.call(this, (properties || []).concat(['isSticker','stickerSrc']));
  };
})(fabric.Object.prototype.toObject);

// --- Upload image as a regular object (backgrounds/images) ---
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: true,  hasControls: true, hasBorders: true, isSticker: false });

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

// --- Sticker metadata --- 
const stickers = [
  { name: 'TweenIT Logo 1', src: 'icons/TweenitLogo1.png' },
  { name: 'TweenIT Logo 2', src: 'icons/TweenitLogo2.png' },
  { name: 'TweenIT Logo 3', src: 'icons/TweenitLogo3.png' },
  { name: 'Squiggle 1', src: 'icons/Squiggle1.png' },
  { name: 'Squiggle 2', src: 'icons/Squiggle2.png' },
  { name: 'Squiggle 3', src: 'icons/Squiggle3.png' },
  { name: 'Bunny', src: 'icons/Bunny.png' },
  { name: 'Puppin', src: 'icons/Puppin.png' },
  { name: 'Skateboard', src: 'icons/Skateboard.png' },
  { name: 'Sunglasses', src: 'icons/Sunglasses.png' },
  { name: 'Blue Star', src: 'icons/StarBlue.png' },
  { name: 'Red Stars', src: 'icons/StarsRed.png' },
  { name: 'Multicolor Stars', src: 'icons/StarsMulti.png' },
  { name: 'Speech Bubble', src: 'icons/Hey.png' },
  // Kids' tags
  { name: 'John Discount Tag 1', src: 'icons/John_Blue.png' },
  { name: 'John Discount Tag 2', src: 'icons/John_Pink.png' },
  { name: 'John Discount Tag 3', src: 'icons/John_Yellow.png' },
  { name: 'John Discount Tag 4', src: 'icons/John_Green.png' },
  { name: 'Erynn Discount Tag 1', src: 'icons/Erynn_Blue.png' },
  { name: 'Erynn Discount Tag 2', src: 'icons/Erynn_Pink.png' },
  { name: 'Erynn Discount Tag 3', src: 'icons/Erynn_Yellow.png' },
  { name: 'Erynn Discount Tag 4', src: 'icons/Erynn_Green.png' },
  { name: 'Olivia Discount Tag 1', src: 'icons/Olivia_Blue.png' },
  { name: 'Olivia Discount Tag 2', src: 'icons/Olivia_Pink.png' },
  { name: 'Olivia Discount Tag 3', src: 'icons/Olivia_Yellow.png' },
  { name: 'Olivia Discount Tag 4', src: 'icons/Olivia_Green.png' },
  { name: 'Amy Discount Tag 1', src: 'icons/Amy_Blue.png' },
  { name: 'Amy Discount Tag 2', src: 'icons/Amy_Pink.png' },
  { name: 'Amy Discount Tag 3', src: 'icons/Amy_Yellow.png' },
  { name: 'Amy Discount Tag 4', src: 'icons/Amy_Green.png' },
  { name: 'Arion Discount Tag 1', src: 'icons/Arion_Blue.png' },
  { name: 'Arion Discount Tag 2', src: 'icons/Arion_Pink.png' },
  { name: 'Arion Discount Tag 3', src: 'icons/Arion_Yellow.png' },
  { name: 'Arion Discount Tag 4', src: 'icons/Arion_Green.png' },
  { name: 'Alyssa Discount Tag 1', src: 'icons/Alyssa_Blue.png' },
  { name: 'Alyssa Discount Tag 2', src: 'icons/Alyssa_Pink.png' },
  { name: 'Alyssa Discount Tag 3', src: 'icons/Alyssa_Yellow.png' },
  { name: 'Alyssa Discount Tag 4', src: 'icons/Alyssa_Green.png' },
  { name: 'Addie Discount Tag 1', src: 'icons/Addie_Blue.png' },
  { name: 'Addie Discount Tag 2', src: 'icons/Addie_Pink.png' },
  { name: 'Addie Discount Tag 3', src: 'icons/Addie_Yellow.png' },
  { name: 'Addie Discount Tag 4', src: 'icons/Addie_Green.png' },
  { name: 'Sienna Discount Tag 1', src: 'icons/Sienna_Blue.png' },
  { name: 'Sienna Discount Tag 2', src: 'icons/Sienna_Pink.png' },
  { name: 'Sienna Discount Tag 3', src: 'icons/Sienna_Yellow.png' },
  { name: 'Sienna Discount Tag 4', src: 'icons/Sienna_Green.png' },
  { name: 'Naoki Discount Tag 1', src: 'icons/Naoki_Blue.png' },
  { name: 'Naoki Discount Tag 2', src: 'icons/Naoki_Pink.png' },
  { name: 'Naoki Discount Tag 3', src: 'icons/Naoki_Yellow.png' },
  { name: 'Naoki Discount Tag 4', src: 'icons/Naoki_Green.png' },
];

// --- Recently used stickers ---
let recentStickers = [];

function renderRecentStickers() {
  const container = document.getElementById('recent-stickers');
  container.innerHTML = '';
  recentStickers.forEach(src => {
    const btn = document.createElement('button');
    btn.style.width = '40px';
    btn.style.height = '40px';
    btn.style.backgroundImage = `url(${src})`;
    btn.style.backgroundSize = 'contain';
    btn.style.backgroundRepeat = 'no-repeat';
    btn.style.backgroundPosition = 'center';
    btn.onclick = () => addSticker(src);
    container.appendChild(btn);
  });
}

// --- Update recent stickers when adding a sticker ---
const oldAddSticker = addSticker;
addSticker = function(src) {
  oldAddSticker(src);

  // update recent stickers
  recentStickers = recentStickers.filter(s => s !== src);
  recentStickers.unshift(src);
  if (recentStickers.length > 8) recentStickers.pop();
  renderRecentStickers();
};

// --- Search stickers ---
const searchInput = document.getElementById('sticker-search');
const searchResults = document.getElementById('search-results');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = '';
  stickers
    .filter(st => st.name.toLowerCase().includes(query))
    .forEach(st => {
      const btn = document.createElement('button');
      btn.style.width = '50px';
      btn.style.height = '50px';
      btn.style.backgroundImage = `url(${st.src})`;
      btn.style.backgroundSize = 'contain';
      btn.style.backgroundRepeat = 'no-repeat';
      btn.style.backgroundPosition = 'center';
      btn.title = st.name;
      btn.onclick = () => addSticker(st.src);
      searchResults.appendChild(btn);
    });
});

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
