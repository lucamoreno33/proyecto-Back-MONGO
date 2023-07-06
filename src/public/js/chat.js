const socket = io()
let user;
let chatbox = document.getElementById('chatBox');
Swal.fire({
    title:"indentificate",
    input:"text",
    text: "ingresa tu nombre usuario",
    inputValidator: (value) => {
        return !value && "Debes ingresar un nombre de usuario para continuar"
    },
    allowOutsideClick: false
}).then(result =>{
    user = result.value
});

socket.on("messageLogs", (data) => {
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach(message => {
        messages += `<p><strong>${message.user}</strong>: ${message.message}</p>`;
        log.innerHTML = messages
    });
});

chatbox.addEventListener("keyup", e =>{
    if(e.key === "Enter"){
        socket.emit("message", {user, message: chatbox.value});
        chatbox.value=""
    }
})

