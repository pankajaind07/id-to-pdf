let frontImage, backImage;

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
        };
        reader.readAsDataURL(file);
    }
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

    doc.addImage(frontImage, 'JPEG', 10, 10, imgWidth, imgHeight);
    doc.addImage(backImage, 'JPEG', pageWidth - imgWidth - 10, 10, imgWidth, imgHeight);

    doc.save("ID_to_PDF.pdf");
}