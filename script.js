// Fabric.js canvas
const canvas = new fabric.Canvas('c', {
  backgroundColor: '#eee' // so you can see the canvas boundaries
});

// Upload user image
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      canvas.clear(); // clear previous
      img.set({
        left: 0,
        top: 0,
        selectable: false // background image not draggable
      });

      // scale image to fit canvas width/height
      img.scaleToWidth(canvas.width);
      img.scaleToHeight(canvas.height);

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
    });
  };
  reader.readAsDataURL(file);
});

// Get reference to canvas
const canvas = new fabric.Canvas('c');

// Handle image upload
document.getElementById('uploader').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = function(f) {
    fabric.Image.fromURL(f.target.result, function(img) {
      img.scaleToWidth(400); // scale image down to fit canvas width
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});



// Add sticker
function addSticker(src) {
  fabric.Image.fromURL(src, function(img) {
    img.scale(0.5);
    img.set({ left: 100, top: 100 });
    canvas.add(img);
    canvas.renderAll(); // force re-draw
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
