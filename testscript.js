const canvas = new fabric.Canvas('c');
let backgroundImage;

// upload background
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // scale background to fit canvas
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);

     document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      // scale proportionally
      let scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      img.scale(scale);
      img.set({ left: 0, top: 0, selectable: true }); // Make it selectable

      canvas.add(img);
      canvas.setActiveObject(img); // Optional: select after adding
      canvas.renderAll();
      console.log("Image added as object!");
    }, { crossOrigin: 'anonymous' });
  };

  if (file) reader.readAsDataURL(file);
});

  if (file) reader.readAsDataURL(file);
});

// add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.set({
      left: 50,
      top: 50,
      hasControls: true,
      hasBorders: true
    });
    img.scaleToWidth(100);
    canvas.add(img);
    canvas.renderAll();
    console.log("Sticker added!");
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
