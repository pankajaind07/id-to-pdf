let frontImage, backImage;
let frontRotation = 0, backRotation = 0;

function previewImage(type) {
    const fileInput = type === 'front' ? document.getElementById('frontPhoto') : document.getElementById('backPhoto');
    const preview = type === 'front' ? document.getElementById('frontPreview') : document.getElementById('backPreview');
    
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            if (type === 'front') frontImage = e.target.result;
            else backImage = e.target.result;
            // Reset rotation when new image is uploaded
            if (type === 'front') frontRotation = 0;
            else backRotation = 0;
            preview.style.transform = `rotate(0deg)`;
        };
        reader.readAsDataURL(file);
    }
}

function rotateImage(type) {
    const preview = type === 'front' ? document.getElementById('frontPreview') : document.getElementById('backPreview');
    let rotation = type === 'front' ? frontRotation : backRotation;
    
    rotation = (rotation + 90) % 360; // Rotate 90 degrees each click
    preview.style.transform = `rotate(${rotation}deg)`;
    
    if (type === 'front') frontRotation = rotation;
    else backRotation = rotation;
}

function createPDF() {
    if (!frontImage || !backImage) {
        alert("Please upload both front and back photos!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const imgWidth = 90;
    const imgHeight = 60;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Create temporary canvas to handle rotation
    const frontCanvas = document.createElement('canvas');
    const backCanvas = document.createElement('canvas');
    const frontCtx = frontCanvas.getContext('2d');
    const backCtx = backCanvas.getContext('2d');

    const frontImg = new Image();
    const backImg = new Image();
    frontImg.src = frontImage;
    backImg.src = backImage;

    frontImg.onload = function() {
        frontCanvas.width = frontRotation % 180 === 0 ? imgWidth : imgHeight;
        frontCanvas.height = frontRotation % 180 === 0 ? imgHeight : imgWidth;
        frontCtx.translate(frontCanvas.width / 2, frontCanvas.height / 2);
        frontCtx.rotate(frontRotation * Math.PI / 180);
        frontCtx.drawImage(frontImg, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

        backImg.onload = function() {
            backCanvas.width = backRotation % 180 === 0 ? imgWidth : imgHeight;
            backCanvas.height = backRotation % 180 === 0 ? imgHeight : imgWidth;
            backCtx.translate(backCanvas.width / 2, backCanvas.height / 2);
            backCtx.rotate(backRotation * Math.PI / 180);
            backCtx.drawImage(backImg, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);

            doc.addImage(frontCanvas.toDataURL('image/jpeg'), 'JPEG', 10, 10, imgWidth, imgHeight);
            doc.addImage(backCanvas.toDataURL('image/jpeg'), 'JPEG', pageWidth - imgWidth - 10, 10, imgWidth, imgHeight);
            doc.save("ID_to_PDF.pdf");
        };
    };
}
