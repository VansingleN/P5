// On récupère l'"orderId" depuis le localStorage pour l'afficher à l'utilisateur, puis on l'efface instantanement avec l'entiereté du localStorage
function checkout() {
    const orderId = document.querySelector("#orderId")
    orderId.innerHTML = localStorage.getItem("orderId")
    localStorage.clear()
}
checkout()
