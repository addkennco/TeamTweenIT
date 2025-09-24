// Fabric.js canvas
const canvas = new fabric.Canvas('c');

// Upload user image
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      canvas.clear(); // clear previous
      img.scaleToWidth(600);
      img.scaleToHeight(600);
      canvas.add(img);
      canvas.sendToBack(img);
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
