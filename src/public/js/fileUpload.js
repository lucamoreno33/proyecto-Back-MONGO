const form = document.querySelector("#upload-form"); 
const profileInput = form.querySelector('input[name="profile"]');
const productInput = form.querySelector('input[name="product"]');
const documentInput = form.querySelector('input[name="document"]');
const userId = document.querySelector('[name="userId"]').id



form.addEventListener("submit", async (e) => {
    e.preventDefault(); 
    const profileFile = profileInput.files[0]
    const productFile = productInput.files[0]
    const documentFile = documentInput.files[0]
    if (profileFile&& !profileFile.type.startsWith("image/")) {
        Swal.fire('Error', 'Por favor suba una imagen de perfil', 'error');
        return;
    } else if (productFile && !productFile.type.startsWith("image/")) {
        Swal.fire('Error', 'Por favor seleccione una imagen para el producto', 'error');
        return;
    } else if (documentFile && !['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(documentFile.type)) {
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
        console.log(response)
        if (response.ok) {
            Swal.fire('Listo!', 'se han cargado los archivos', 'success');
        } else {
            Swal.fire('Error inesperado', 'No se han cargado los archivos', 'error');
        }
    } catch (error) {
        console.error("Error en la solicitud Fetch:", error);
    }
});