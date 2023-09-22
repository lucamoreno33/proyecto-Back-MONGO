import Swal from "sweetalert2";
export const passwordRecovery = () =>{
    Swal.fire({
        title: 'Recuperación de contraseña',
        text: 'Por favor, ingresa tu correo electrónico:',
        input: 'email',
        inputPlaceholder: 'Correo electrónico',
        showCancelButton: true,
        confirmButtonText: 'Enviar correo de recuperación',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes ingresar tu correo electrónico';
            }
        },
    }).then((result) => {    
        if (result.isConfirmed) {
            const email = result.value;
            fetch('/passwordRecovery', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
                })
                .then(response => response.json())
                .then(data => {
                    Swal.fire('Correo enviado', 'Se ha enviado un correo de recuperación a la dirección proporcionada.', 'success');
            })
            .catch(error => {
                console.error(error);
                Swal.fire('Error', 'Ha ocurrido un error al enviar el correo de recuperación.', 'error');
            });
        }
    });
}
