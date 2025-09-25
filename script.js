document.addEventListener('DOMContentLoaded', () => {

  const canvas = new fabric.Canvas('c', { preserveObjectStacking: true });

  // --- Checkerboard Pattern ---
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 20;
  patternCanvas.height = 20;
  const ctx = patternCanvas.getContext('2d');
  const light = '#fff';
  const dark = '#ccc';
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, 20, 20);
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, 10, 10);
  ctx.fillRect(10, 10, 10, 10);
  const checkerboardPattern = new fabric.Pattern({ source: patternCanvas, repeat: 'repeat' });
  canvas.setBackgroundColor(checkerboardPattern, canvas.renderAll.bind(canvas));

  // --- Fabric Defaults ---
  fabric.Object.prototype.set({
    borderColor: 'black',
    cornerStrokeColor: 'black',
    cornerSize: 12,
    transparentCorners: true
  });

  // --- DRY Delete Control ---
  function createDeleteControl() {
    return new fabric.Control({
      x: 0.5,
      y: -0.5,
      cursorStyle: 'pointer',
      mouseUpHandler: function(eventData, transform) {
        canvas.remove(transform.target);
        canvas.renderAll();
        saveState();
      },
      render: function(ctx, left, top, styleOverride, fabricObject) {
        const size = 20;
        const angle = fabric.util.degreesToRadians(fabricObject.angle);
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(angle);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(-size/2, -size/2, size, size);
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('×', 0, 0);
        ctx.restore();
      }
    });
  }

  // --- Sticker Stacker ---
  function restackStickers() {
    canvas.getObjects().forEach(obj => { if (obj.isSticker) canvas.bringToFront(obj); });
    canvas.renderAll();
  }

  // --- Extend toObject for Sticker Metadata ---
  fabric.Object.prototype.toObject = (function(toObject) {
    return function(properties) {
      return toObject.call(this, (properties || []).concat(['isSticker','stickerSrc']));
    };
  })(fabric.Object.prototype.toObject);

  // --- Upload Image ---
  const uploader = document.getElementById('uploader');
  const uploadButton = document.getElementById('upload-button');
  uploadButton.addEventListener('click', () => uploader.click());
  uploader.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = f => {
      fabric.Image.fromURL(f.target.result, img => {
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        img.scale(scale);
        img.set({ left: 0, top: 0, selectable: true, hasControls: true, hasBorders: true, isSticker: false });
        img.controls.tr = createDeleteControl();
        canvas.add(img);
        canvas.setActiveObject(img);
        restackStickers();
      }, { crossOrigin: 'anonymous' });
      e.target.value = '';
    };
    reader.readAsDataURL(file);
  });

  // --- Add Sticker ---
  function addSticker(src) {
    fabric.Image.fromURL(src, img => {
      img.set({ left: 50, top: 50, selectable: true, hasControls: true, hasBorders: true, stickerSrc: src, isSticker: true });
      img.scaleToWidth(100);
      img.controls.tr = createDeleteControl();
      canvas.add(img);
      canvas.setActiveObject(img);
      restackStickers();
    }, { crossOrigin: 'anonymous' });
  }
  window.addSticker = addSticker;

  // --- Sticker Metadata ---
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
    { name: 'Naoki Discount Tag 4', src: 'icons/Naoki_Green.png' }
  ];

  // --- Recently Used Stickers ---
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
    recentStickers = recentStickers.filter(s => s !== src);
    recentStickers.unshift(src);
    if (recentStickers.length > 8) recentStickers.pop();
    renderRecentStickers();
  };

  // --- Search Stickers ---
  const searchInput = document.getElementById('sticker-search');
  const searchResults = document.getElementById('search-results');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    stickers.filter(st => st.name.toLowerCase().includes(query)).forEach(st => {
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

  // --- Help Popup ---
  window.showHelp = function() {
    alert(`
Welcome to the Team TweenIT Postmaker! 🎨

- Use the Undo / Redo icons to fix mistakes.
- Upload images to add your own designs.
- Search and add stickers using the search bar.
- Recently used stickers appear in the "Recently Used" section.
- Download your final image with the download icon.
- Clear the canvas with the eraser icon if you want to start fresh.

Have fun creating!
    `);
  };

  // --- Add Text ---
  window.addText = function() {
    const text = new fabric.Textbox('Your text here', {
      left: 100, top: 100,
      fontFamily: 'Arial Rounded MT Bold',
      fontSize: 30,
      fill: '#000000',
      selectable: true,
      hasControls: true,
      hasBorders: true
    });
    text.controls.tr = createDeleteControl();
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    restackStickers();
    saveState();
  };

  // --- Font / Color / Size Controls ---
  document.getElementById('font-selector').addEventListener('change', e => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'textbox') { obj.set('fontFamily', e.target.value); canvas.requestRenderAll(); }
  });
  document.getElementById('text-color-picker').addEventListener('input', e => {
    const obj = canvas.getActiveObject();
    if (obj && obj.type === 'textbox') { obj.set('fill', e.target.value); canvas.renderAll(); saveState(); }
  });
  const sizeInput = document.getElementById('font-size');
  const sizeDisplay = document.getElementById('font-size-display');
  sizeInput.addEventListener('input', () => {
    const obj = canvas.getActiveObject();
    const newSize = parseInt(sizeInput.value, 10);
    sizeDisplay.textContent = newSize;
    if (obj && obj.type === 'textbox') { obj.set('fontSize', newSize); canvas.requestRenderAll(); }
  });

  // --- Undo / Redo ---
  let undoStack = [], redoStack = [];
  const maxHistory = 25;
  let isRestoring = false;
  function saveState() {
    if (isRestoring) return;
    redoStack = [];
    undoStack.push(canvas.toDatalessJSON());
    if (undoStack.length > maxHistory) undoStack.shift();
  }
  canvas.on('object:added', () => { if (!isRestoring) setTimeout(() => { restackStickers(); saveState(); },0); });
  canvas.on('object:modified', () => { if (!isRestoring) setTimeout(() => { restackStickers(); saveState(); },0); });
  canvas.on('object:removed', () => { if (!isRestoring) setTimeout(() => { restackStickers(); saveState(); },0); });
  window.undo = () => { if (undoStack.length>1){ isRestoring=true; redoStack.push(undoStack.pop()); canvas.loadFromJSON(undoStack[undoStack.length-1],()=>{restackStickers(); isRestoring=false;});}};
  window.redo = () => { if(redoStack.length>0){ isRestoring=true; const state=redoStack.pop(); undoStack.push(state); canvas.loadFromJSON(state,()=>{restackStickers(); isRestoring=false;});}};
  saveState();

  // --- Clear Canvas ---
  window.clearCanvas = () => {
    if (confirm("Are you sure you want to clear the canvas?")) {
      canvas.clear();
      canvas.setBackgroundColor(checkerboardPattern, canvas.renderAll.bind(canvas));
      saveState();
    }
  };

  // --- Download ---
  window.download = () => {
    canvas.discardActiveObject();
    canvas.renderAll();
    const oldBg = canvas.backgroundColor;
    canvas.backgroundColor = null;
    canvas.renderAll();
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1 });
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'final.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    canvas.backgroundColor = oldBg;
    canvas.renderAll();
  };

});
 // end DOMContentLoaded
