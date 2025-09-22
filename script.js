// Upload user image
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      canvas.clear(); // clear previous
      img.scaleToWidth(canvas.width); // scale to canvas width
      // optional: maintain aspect ratio automatically
      canvas.add(img);
      canvas.sendToBack(img);
      canvas.requestRenderAll(); // ensures canvas updates
    });
  };
  reader.readAsDataURL(file);
});

// Add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.scale(0.5);
    img.set({ left: Math.random() * 400, top: Math.random() * 400 }); // optional: random position
    canvas.add(img);
    canvas.requestRenderAll(); // ensures sticker shows immediately
  });
}
