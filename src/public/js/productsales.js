const buttons = document.querySelectorAll('#productsList button');
const cartLink = document.getElementById("cartLink")

buttons.forEach((button) => {
    button.addEventListener('click', async () => {
        let cart = document.getElementById("cartLink").name
        const response = await fetch(`/api/carts/${cart}/products/${button.name}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });
    });
});

window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});