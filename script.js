// Fabric.js canvas
const canvas = new fabric.Canvas('c', {
  backgroundColor: '#c9f4ff'
});

// Upload user image
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // Scale the image to fit within canvas
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);

      // Set as background image
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2
      });
    }, { crossOrigin: 'anonymous' });
  };
  reader.readAsDataURL(file);
});

// Add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.scale(0.5);
    img.set({ left: 100, top: 100 });
    canvas.add(img);
    canvas.setActiveObject(img); // make it draggable right away
    canvas.renderAll();
  }, { crossOrigin: 'anonymous' });
}

// Download final image
document.getElementById('download').addEventListener('click', function() {
  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1
  });
  const link = document.createElement('a');
  link.href
