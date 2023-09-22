const passRecoverForm = document.getElementById("passRecoverForm");

passRecoverForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    const newPassword = document.querySelector("input[name='password']").value;
    console.log("Enviando solicitud fetch...")
    fetch(`/api/help/passwordRecovery`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, email }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                Swal.fire('Error', data.error, 'error');
            } else {
                Swal.fire('Contraseña restablecida', 'Tu contraseña ha sido restablecida con éxito.', 'success');
            }
        })
    .catch(error => {
        console.error(error);
        Swal.fire('Error', 'Ha ocurrido un error al restablecer la contraseña.', 'error');
    });
})