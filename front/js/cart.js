function injectArticle(parsedItem, i) {
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

    injectInputContainer(parsedItem, i, div__cart__item__content, price)
}

function injectInputContainer(parsedItem, i, div__cart__item__content, price) {
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
    displayTotalProducts()
}

function deleteProductFromCart(parsedItem) {
    const productDeletion = cart.findIndex(product => product.id === parsedItem.id && product.color === parsedItem.color)
    console.log("itemtodelete", productDeletion);
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
    quantity.addEventListener("change", () => updateTotalProducts(parsedItem.id, parsedItem.color, Number(quantity.value), i))
    divQuantity.appendChild(quantity)

    getPriceFromBackend(quantity, price, i, parsedItem)
}

function getPriceFromBackend(quantity, price, i, parsedItem) {
    fetch('http://localhost:3000/api/products')
        .then((res) => res.json())
        .then((res) => displayAllPrices(quantity, price, res, i, parsedItem))
}

function displayAllPrices(quantity, price, res, i, parsedItem) {
    const productWithPriceFromBack = cart.find(product => product.id === parsedItem.id && product.color === parsedItem.color)
    productWithPriceFromBack.price = res.find(product => product._id === parsedItem.id).price
    console.log(productWithPriceFromBack);
    price.innerHTML = "Prix : " + quantity.value * cart[i].price + " €"
    const totalPriceContainer = document.querySelector("#totalPrice")
    totalPrice += parsedItem.quantity * cart[i].price
    totalPriceContainer.innerHTML = totalPrice

    displayTotalProducts()
    updateAllPrices(quantity, price, i)
}

function updateAllPrices(quantity, price, i) {

    quantity.addEventListener('change', function () {
        const totalPriceContainer = document.querySelector("#totalPrice")
        price.innerHTML = "Prix : " + quantity.value * cart[i].price + " €"
        let modifiedTotalPrice = 0
        cart.forEach((p) => modifiedTotalPrice += (p.price * p.quantity))
        totalPriceContainer.innerHTML = modifiedTotalPrice
    })
}

function displayTotalProducts() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, parsedItem) => total + Number(parsedItem.quantity), 0)
    totalQuantity.innerHTML = total
}

function updateTotalProducts(id, color, quantityValue) {
    const modifyInCart = cart.find((product) => product.id === id && product.color === color)
    modifyInCart.quantity = Number(quantityValue)

    displayTotalProducts()
}


function getUserDataAndVerify() {
    const order = document.querySelector("#order")
    order.addEventListener("click", (event) => {
        event.preventDefault();
        if (cart.length === 0) {
            alert("Le panier est vide")
            return
        }

        const userData = {
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            address: document.querySelector("#address").value,
            city: document.querySelector("#city").value,
            email: document.querySelector("#email").value,
        }

        if (userData.firstName === "") {
            const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
            firstNameErrorMsg.innerHTML = "Veuillez entrer votre prénom"
        }
        else {
            firstNameErrorMsg.innerHTML = ""
        }
        if (userData.lastName === "") {
            const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
            lastNameErrorMsg.innerHTML = "Veuillez entrer votre nom"
        }
        else {
            lastNameErrorMsg.innerHTML = ""
        }
        if (userData.address === "") {
            const addressErrorMsg = document.querySelector("#addressErrorMsg");
            addressErrorMsg.innerHTML = "Veuillez entrer votre adresse"
        }
        else {
            addressErrorMsg.innerHTML = ""
        }
        const cityVerification = /^[^!¡?÷¿/+=@#£¤µ¨§$%&*(){}|~<>;:[\]]+$/
        if (cityVerification.test(userData.city) === false) {
            const cityErrorMsg = document.querySelector("#cityErrorMsg");
            cityErrorMsg.innerHTML = "Veuillez entrer un nom de ville valide"
        }
        else {
            cityErrorMsg.innerHTML = ""
        }
        const emailVerification = /.+@.+\..+/
        if (emailVerification.test(userData.email) === false) {
            const emailErrorMsg = document.querySelector("#emailErrorMsg");
            emailErrorMsg.innerHTML = "Veuillez entrer une adresse mail valide"
        }
        else {
            emailErrorMsg.innerHTML = ""
        }
        if (userData.firstName === "" || userData.lastName === "" || userData.address === "" || cityVerification.test(userData.city) === false || emailVerification.test(userData.email) === false)
            return

        console.log(userData);
    })

}
function loopOverLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const getItem = localStorage.getItem(localStorage.key(i));
        const parsedItem = JSON.parse(getItem)
        cart.push(parsedItem)

        injectArticle(parsedItem, i)
    }
}

let totalPrice = 0
let cart = []
loopOverLocalStorage()
getUserDataAndVerify()