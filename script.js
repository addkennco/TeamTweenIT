// Fabric.js canvas
const canvas = new fabric.Canvas('c');

// Upload user image
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        originX: 'center',
        originY: 'center',
        left: canvas.width / 2,
        top: canvas.height / 2
      });
    });
  };
  reader.readAsDataURL(file);
});

// Add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.scale(0.5);
    img.set({ left: 100, top: 100 });
    canvas.add(img);
  });
}

// Download final image
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
