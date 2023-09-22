
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (event) =>{
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));
    const response = await fetch("/api/sessions/login", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    });
    const responseData = await response.json();
    console.log(responseData)
    if (responseData.status === 'success') {
        window.location.replace('/');
    }
});


const passwordRecoveryButton = document.getElementById("passRecover")

passwordRecoveryButton.addEventListener('click', async () => {
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
                fetch('/api/help/passwordRecoveryMail', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }),
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        Swal.fire('Correo enviado', 'Se ha enviado un correo de recuperación a la dirección proporcionada.', 'success');
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire('Error', 'Ha ocurrido un error al enviar el correo de recuperación.', 'error');
                });
            }
        });
    }
)




