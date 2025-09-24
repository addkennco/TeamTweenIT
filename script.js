// Initialize canvas
const canvas = new fabric.Canvas('c', {
  preserveObjectStacking: true
});

// ====================
// Handle image upload
// ====================
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // Scale image to fit inside canvas
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);

      // Clear old stuff
      canvas.clear();

      // Set background image
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2
      });

      console.log("Background image added to canvas");
    });
  };
  reader.readAsDataURL(file);
});

// ====================
// Add stickers
// ====================
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.set({
      left: 50,
      top: 50,
      hasControls: true,
      selectable: true
    });
    img.scale(0.3); // adjust size of stickers
    canvas.add(img);
    canvas.setActiveObject(img);
  });
}

// Example sticker buttons
document.getElementById('bunny').addEventListener('click', function() {
  addSticker('stickers/bunny.png');
});

document.getElementById('puppin').addEventListener('click', function() {
  addSticker('stickers/puppin.png');
});

// ====================
// Download final image
// ====================
document.getElementById('download').addEventListener('click', function() {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1
  });

  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final-image.png';
  link.click();
});
