const purchaseBtn = document.getElementById("purchaseButton")
const cid = document.getElementById("purchaseButton").name
purchaseBtn.addEventListener("click", async() =>{
    const response = await fetch(`/api/carts/${cid}/purchase`, {
        method: "PUT",
    });
    if (response.ok) {
        const { data: { ticket } } = await response.json();
        window.location.replace(`/ticket/${ticket.code}`);
    } else {
        console.error("Ocurrió un error al comprar el carrito");
    }
});