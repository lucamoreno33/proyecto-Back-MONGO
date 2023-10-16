const btn = document.getElementById("logout")

btn.addEventListener("click", async (e)=> {
    e.preventDefault();
    console.log(1)
    const response = await fetch("/api/sessions/logout", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const responseData = await response.json();
    if (responseData.status === 'success') {
        window.location.replace('/');
    }
})

