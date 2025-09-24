console.log("JS loaded");

const canvas = new fabric.Canvas('c');

canvas.setBackgroundColor('red', canvas.renderAll.bind(canvas));

// Debug: add a blue rectangle to confirm drawing works
canvas.add(new fabric.Rect({
  left: 10,
  top: 10,
  fill: 'blue',
  width: 100,
  height: 100
}));
canvas.renderAll();

// upload background as a regular object
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // Delete all objects (optional, if you only want one image at a time)
      // canvas.clear();

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

// download final image
function downloadImage() {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = 'final.png';
  link.click();
}
