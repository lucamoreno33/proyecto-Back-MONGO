const form = document.querySelector("#upload-form"); 
const fileInput = form.querySelector('input[type="file"]');
const fileTypeSelect = form.querySelector('select[name="fileType"]');
const userId = document.querySelector('[name="userId"]').id
form.addEventListener("submit", async (e) => {
    e.preventDefault(); 

    // Verifica si se seleccionó un archivo
    if (fileInput.files.length === 0) {
        Swal.fire('Error', 'Por favor seleccione un archivo', 'error');
        return;
    }

    // Descarta contradicciones en los tipos de archivo
    const selectedFileType = fileTypeSelect.value;
    const selectedFile = fileInput.files[0];
    if (selectedFileType === "profile" && !selectedFile.type.startsWith("image/")) {
        Swal.fire('Error', 'Por favor suba una imagen de perfil', 'error');
        return;
    } else if (selectedFileType === "product" && !selectedFile.type.startsWith("image/")) {
        Swal.fire('Error', 'Por favor seleccione una imagen para el producto', 'error');
        return;
    } else if (selectedFileType === "document" && !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selectedFile.type)) {
        Swal.fire('Error', 'Formato de archivo no aceptado. Por favor, sube un archivo PDF o DOCX.', 'error');
        return;
    }

    const data = new FormData(form);
    const url = `/api/users/${userId}/documents`;
    try {
        const response = await fetch(url, {
        method: "POST",
        body: data,
        });
        if (response.ok) {
            Swal.fire('Listo!', 'se ha cargado el archivo', 'success');
        } else {
            Swal.fire('Error inesperado', 'No se ha cargado el archivo', 'error');
        }
    } catch (error) {
        console.error("Error en la solicitud Fetch:", error);
    }
});