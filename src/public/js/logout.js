const btn = document.getElementById("logout")

btn.addEventListener("click", async (e)=> {
    e.preventDefault();
    const response = await fetch("/api/sessions/logout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    const responseData = await response.json();
    
    window.location.replace('/login');
    
})

