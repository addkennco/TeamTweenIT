const canvas = new fabric.Canvas('c');

// Optionally set a background color to verify rendering
canvas.setBackgroundColor('lightgrey', canvas.renderAll.bind(canvas));

// upload image as a regular object
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // Scale proportionally to fit canvas
      let scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: true });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      console.log("Image added as object!", img);
      console.log("Canvas objects:", canvas.getObjects());
    }, { crossOrigin: 'anonymous' });
  };

  reader.readAsDataURL(file);
});

// add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.set({
      left: 50,
      top: 50,
      hasControls: true,
      hasBorders: true,
      selectable: true
    });
    img.scaleToWidth(100);
    canvas.add(img);
    canvas.setActiveObject(img);
    canvas.renderAll();
    console.log("Sticker added!", img);
  }, { crossOrigin: 'anonymous' });
}
window.addSticker = addSticker;

// remove sticker
function removeSticker(src) {
  const toRemove = canvas.getObjects('image').filter(img => img.getSrc && img.getSrc().includes(src));
  toRemove.forEach(obj => canvas.remove(obj));
  canvas.renderAll();
  console.log("Removed stickers for", src);
}
window.removeSticker = removeSticker;

// download final image
function downloadImage() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final.png';
  link.click();
}
window.downloadImage = downloadImage;
