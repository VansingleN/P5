function loopOverLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const getItem = localStorage.getItem(localStorage.key(i));
        const parsedItem = JSON.parse(getItem)
        cart.push(parsedItem)

        displayArticle(parsedItem, i)
    }
}

function displayArticle(parsedItem, i) {
    const cart__item = document.createElement("article")
    cart__item.classList = "cart__item"
    cart__item.dataset.id = parsedItem.id
    cart__item.dataset.color = parsedItem.color
    const cart__items = document.querySelector("#cart__items")
    cart__items.appendChild(cart__item)

    displayImage(parsedItem, i, cart__item)
}

function displayImage(parsedItem, i, cart__item) {
    const div__cart__item__img = document.createElement("div")
    div__cart__item__img.classList = "cart__item__img"
    cart__item.appendChild(div__cart__item__img)
    const image = document.createElement("img")
    image.src = parsedItem.image
    div__cart__item__img.appendChild(image)

    displayDescription(parsedItem, i, cart__item)
}

function displayDescription(parsedItem, i, cart__item) {
    const div__cart__item__content = document.createElement("div")
    div__cart__item__content.classList = "cart__item__content"
    cart__item.appendChild(div__cart__item__content)
    const description = document.createElement("div")
    description.classList = "cart__item__content__description"
    div__cart__item__content.appendChild(description)
    let cart__item__content__description = document.querySelectorAll(".cart__item__content__description")[i]

    const name = document.createElement("h2")
    name.innerHTML = parsedItem.name
    const color = document.createElement("p")
    color.innerHTML = "Couleur : " + parsedItem.color
    let price = document.createElement("p")
    cart__item__content__description.append(name, color, price)

    displayInputContainer(parsedItem, i, div__cart__item__content, price)
}

function displayInputContainer(parsedItem, i, div__cart__item__content, price) {
    const divSettings = document.createElement("div")
    divSettings.classList = "cart__item__content__settings"
    div__cart__item__content.appendChild(divSettings)
    const cart__item__content__settings = document.querySelectorAll(".cart__item__content__settings")[i]
    const divQuantity = document.createElement("div")
    divQuantity.classList = "cart__item__content__settings__quantity"
    cart__item__content__settings.appendChild(divQuantity)
    const quantity_paragraph = document.createElement("p")
    quantity_paragraph.innerHTML = "Quantité :"
    divQuantity.appendChild(quantity_paragraph)

    displayDeleteButton(i, cart__item__content__settings, parsedItem)
    displayQuantity(divQuantity, parsedItem, price, i)
}

function displayDeleteButton(i, cart__item__content__settings, parsedItem) {
    const divDelete = document.createElement("div")
    divDelete.classList = "cart__item__content__settings__delete"
    cart__item__content__settings.appendChild(divDelete)
    const cart__item__content__settings__delete = document.querySelectorAll(".cart__item__content__settings__delete")[i]
    const deleteButton = document.createElement("p")
    deleteButton.classList = "deleteItem"
    deleteButton.innerHTML = "Supprimer"
    cart__item__content__settings__delete.appendChild(deleteButton)
    deleteButton.addEventListener("click", () => deleteProduct(parsedItem))
}

function deleteProduct(parsedItem) {
    deleteProductFromCart(parsedItem)
    deleteProductFromStorage(parsedItem)
    deleteProductFromPage(parsedItem)
    displayTotalProductsQuantity()
    updateTotalCartPrice()
}

function deleteProductFromCart(parsedItem) {
    const productDeletion = cart.findIndex(product => product.id === parsedItem.id && product.color === parsedItem.color)
    cart.splice(productDeletion, 1)
}
function deleteProductFromStorage(parsedItem) {
    const product = parsedItem.id + parsedItem.color
    localStorage.removeItem(product)
}
function deleteProductFromPage(parsedItem) {
    const productToDelete = document.querySelector(`article[data-id="${parsedItem.id}"][data-color="${parsedItem.color}"]`)
    productToDelete.remove()
}

function displayQuantity(divQuantity, parsedItem, price, i) {
    let quantity = document.createElement("input")
    quantity.type = "number"
    quantity.classList = "itemQuantity"
    quantity.name = "itemQuantity"
    quantity.min = "1"
    quantity.max = "100"
    quantity.value = cart[i].quantity
    quantity.addEventListener("change", () => updateTotalProductsQuantity(parsedItem.id, parsedItem.color, Number(quantity.value), i))
    divQuantity.appendChild(quantity)

    getPriceFromBackend(quantity, price, i, parsedItem)
}

function getPriceFromBackend(quantity, price, i, parsedItem) {
    fetch('http://localhost:3000/api/products')
        .then((res) => res.json())
        .then((res) => displayProductsIndividualPrices(quantity, price, res, i, parsedItem))
}

function displayProductsIndividualPrices(quantity, price, res, i, parsedItem) {
    const productWithPriceFromBack = cart.find(product => product.id === parsedItem.id && product.color === parsedItem.color)
    productWithPriceFromBack.price = res.find(product => product._id === parsedItem.id).price
    price.innerHTML = "Prix : " + quantity.value * cart[i].price + " €"
    displayTotalCartPrice(parsedItem, i, quantity, price)
}

function displayTotalCartPrice(parsedItem, i, quantity, price) {
    const totalPriceContainer = document.querySelector("#totalPrice")
    totalPrice += parsedItem.quantity * cart[i].price
    totalPriceContainer.innerHTML = totalPrice

    displayTotalProductsQuantity()
    updateProductsIndividualPrices(quantity, price, i)
}

function updateProductsIndividualPrices(quantity, price, i) {
    quantity.addEventListener('change', function () {
        price.innerHTML = "Prix : " + quantity.value * cart[i].price + " €"
        
        updateTotalCartPrice()
    })
}

function updateTotalCartPrice() {
    const totalPriceContainer = document.querySelector("#totalPrice")
    let modifiedTotalPrice = 0
    cart.forEach((p) => modifiedTotalPrice += (p.price * p.quantity))
    totalPriceContainer.innerHTML = modifiedTotalPrice
}

function displayTotalProductsQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, parsedItem) => total + Number(parsedItem.quantity), 0)
    totalQuantity.innerHTML = total
}

function updateTotalProductsQuantity(id, color, quantityValue) {
    const productInCart = cart.find((product) => product.id === id && product.color === color)
    productInCart.quantity = Number(quantityValue)

    updateProductQuantityInLocalStorage(productInCart, Number(quantityValue))
    displayTotalProductsQuantity()
}

function updateProductQuantityInLocalStorage(productInCart, quantity) {
    const idc = productInCart.id + productInCart.color
    const productInStorage = localStorage.getItem(idc)
    const parsedProduct = JSON.parse(productInStorage)
    parsedProduct.quantity = quantity
    const stringifiedProduct = JSON.stringify(parsedProduct)
    localStorage.setItem(idc, stringifiedProduct)
}

function getContactAndVerify() {
    const order = document.querySelector("#order")
    order.addEventListener("click", (event) => {
        event.preventDefault();
        if (cart.length === 0) {
            alert("Le panier est vide")
            return
        }

        let contact = {
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            address: document.querySelector("#address").value,
            city: document.querySelector("#city").value,
            email: document.querySelector("#email").value,
        }

        const globalVerification = /^[^!¡?÷¿/+=@#£¤µ¨§$%&*(){}|~<>;:[\]]+$/

        if (globalVerification.test(contact.firstName) === false) {
            const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
            firstNameErrorMsg.innerHTML = "Veuillez entrer un prénom valide"
        }
        else {
            firstNameErrorMsg.innerHTML = ""
        }
        if (globalVerification.test(contact.lastName) === false) {
            const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
            lastNameErrorMsg.innerHTML = "Veuillez entrer un nom valide"
        }
        else {
            lastNameErrorMsg.innerHTML = ""
        }
        if (globalVerification.test(contact.address) === false) {
            const addressErrorMsg = document.querySelector("#addressErrorMsg");
            addressErrorMsg.innerHTML = "Veuillez entrer une adresse valide"
        }
        else {
            addressErrorMsg.innerHTML = ""
        }
        if (globalVerification.test(contact.city) === false) {
            const cityErrorMsg = document.querySelector("#cityErrorMsg");
            cityErrorMsg.innerHTML = "Veuillez entrer un nom de ville valide"
        }
        else {
            cityErrorMsg.innerHTML = ""
        }
        const emailVerification = /.+@.+\..+/
        if (emailVerification.test(contact.email) === false) {
            const emailErrorMsg = document.querySelector("#emailErrorMsg");
            emailErrorMsg.innerHTML = "Veuillez entrer une adresse mail valide"
        }
        else {
            emailErrorMsg.innerHTML = ""
        }
        if (globalVerification.test(contact.firstName) === false || globalVerification.test(contact.lastName) === false || globalVerification.test(contact.address) === false || globalVerification.test(contact.city) === false || emailVerification.test(contact.email) === false)
            return

        let products = []
        for (i = 0; i < cart.length; i++) {
            products.push(cart[i].id)

        }
        const order = {
            contact,
            products,
        }
        setupRequest(order)
    })
}

function setupRequest(order) {
    const stringifiedOrder = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
            "Content-Type": "application/json"
        }
    }
    postRequest(stringifiedOrder)
}

function postRequest(stringifiedOrder) {
    fetch("http://localhost:3000/api/products/order", stringifiedOrder)
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("orderId", data.orderId),
                document.location.href = "confirmation.html?id=" + data.orderId
        })
}

let totalPrice = 0
let cart = []
loopOverLocalStorage()
getContactAndVerify()