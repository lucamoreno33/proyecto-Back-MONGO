import config from "../../config/config";
const buttons = document.querySelectorAll('#productsList button');
const cartLink = document.getElementById("cartLink")
const url = config.URL
buttons.forEach((button) => {
    button.addEventListener('click', async () => {
        let cart = document.getElementById("cartLink").name
        if (cart === ""){
            cart = "123456789012345678901234"
        }
        const response = await fetch(`/api/carts/${cart}/products/${button.name}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (data.cart){
            cartLink.name = data.cart
            cartLink.href = `${url}/cart/${data.cart}`
        }
        
    });
});

window.addEventListener("pageshow", function(event) {
    if (event.persisted) {
        window.location.reload();
    }
});