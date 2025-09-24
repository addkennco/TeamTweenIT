document.addEventListener('DOMContentLoaded', () => {

  const canvas = new fabric.Canvas('c', {
    preserveObjectStacking: true
  });
  canvas.setBackgroundColor('lightgrey', canvas.renderAll.bind(canvas));

  // --- Make all object borders and corners black ---
fabric.Object.prototype.set({
  borderColor: 'black',
  cornerStrokeColor: 'black',
  cornerSize: 12,
  transparentCorners: true
});

  // --- Helper to restack stickers above everything else ---
  function restackStickers() {
  canvas.getObjects().forEach(obj => {
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

  // --- Upload image ---
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      let scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      img.scale(scale);

      img.set({
        left: 0,
        top: 0,
        selectable: true,
        hasControls: true,
        hasBorders: true,
        isSticker: false
      });

      // --- Delete control (top-right) ---
      img.controls.tr = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetX: 16,
        offsetY: -16,
        cursorStyle: 'pointer',
        mouseUpHandler: function(eventData, transform) {
          canvas.remove(transform.target);
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

    e.target.value = ''; // Clear file input
  };

  reader.readAsDataURL(file);
});

  // --- Add sticker ---
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.set({
      left: 50,
      top: 50,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      stickerSrc: src,
      isSticker: true
    });
    img.scaleToWidth(100);

    // --- Delete control (top-right) ---
    img.controls.tr = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetX: 16,
      offsetY: -16,
      cursorStyle: 'pointer',
      mouseUpHandler: function(eventData, transform) {
        canvas.remove(transform.target);
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
   // Kids' tags { name: 'John Discount Tag 1', src: 'icons/John_Blue.png' }, 
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
    { name: 'Naoki Discount Tag 4', src: 'icons/Naoki_Green.png' }, ];

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

// Clear the canvas completely
window.clearCanvas = function() {
  if (confirm("Are you sure you want to clear the canvas?")) {
    canvas.clear();
    canvas.backgroundColor = 'lightgrey';
    canvas.renderAll();
    saveState();
  }
};

// Help Popup
window.showHelp = function() {
  const helpText = `
  Welcome to the Team TweenIT Postmaker! 🎨

  - Use the Undo / Redo icons to fix mistakes.
  - Upload images to add your own designs.
  - Search and add stickers using the search bar.
  - Recently used stickers appear in the "Recently Used" section.
  - Download your final image with the download icon.
  - Clear the canvas with the eraser icon if you want to start fresh.
  
  Have fun creating!
  `;
  alert(helpText);
};

  // --- Text Editor ---
  window.addText = function() {
  const text = new fabric.Textbox('Your text here', {
    left: 100,
    top: 100,
    fontFamily: 'Arial Rounded MT Bold', // default
    fontSize: 30,
    fill: '#000000', // default color
    selectable: true,
    hasControls: true,
    hasBorders: true,
  });

  // Add delete control (top-right)
  text.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetX: 16,
    offsetY: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: function(eventData, transform) {
      canvas.remove(transform.target);
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

  canvas.add(text);
  canvas.setActiveObject(text);
  canvas.renderAll();
  restackStickers();
  saveState();
};

  // --- Font Selector ---
document.getElementById('font-selector').addEventListener('change', e => {
  const obj = canvas.getActiveObject();
  if (obj && obj.type === 'textbox') {
    obj.set('fontFamily', e.target.value);
    canvas.requestRenderAll();
  }
});

  // --- Color Picker ---
  document.getElementById('text-color-picker').addEventListener('input', function() {
  const active = canvas.getActiveObject();
  if (active && active.type === 'textbox') {
    active.set('fill', this.value);
    canvas.renderAll();
    saveState();
  }
});

  // --- Font Size ---
  const sizeInput = document.getElementById('font-size');
const sizeDisplay = document.getElementById('font-size-display');

sizeInput.addEventListener('input', () => {
  const obj = canvas.getActiveObject();
  const newSize = parseInt(sizeInput.value, 10);
  sizeDisplay.textContent = newSize;

  if (obj && obj.type === 'textbox') {
    obj.set('fontSize', newSize);
    canvas.requestRenderAll();
  }
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

  canvas.on('object:added', () => { if (!isRestoring) setTimeout(() => { restackStickers(); saveState(); }, 0); });
  canvas.on('object:modified', () => { if (!isRestoring) setTimeout(() => { restackStickers(); saveState(); }, 0); });
  canvas.on('object:removed', () => { if (!isRestoring) setTimeout(() => { restackStickers(); saveState(); }, 0); });

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

  saveState(); // Save initial empty canvas

  // --- Download ---
  function download() {
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
    const a = document.createElement('a');
    a.href = dataURL.replace('image/png', 'image/octet-stream');
    a.download = 'final.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  window.download = download;

}); // end DOMContentLoaded
