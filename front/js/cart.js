function displayImage(parsedItem) {
    const cart__item__img = document.querySelector(".cart__item__img")
    const image = document.createElement("img")
    image.src = parsedItem.image
    cart__item__img.appendChild(image)
}

function displayDescription(parsedItem, i) {
    const cart__item__content = document.querySelector(".cart__item__content")
    const description = document.createElement("div")
    description.classList = "cart__item__content__description"
    cart__item__content.appendChild(description)
    let cart__item__content__description = document.querySelectorAll(".cart__item__content__description")[i]

    const name = document.createElement("h2")
    name.innerHTML = parsedItem.name
    const color = document.createElement("p")
    color.innerHTML = "Couleur : " + parsedItem.color
    let price = document.createElement("p")

    cart__item__content__description.append(name, color, price)

    injectInputContainer(parsedItem, i, cart__item__content, price)
}

function injectInputContainer(parsedItem, i, cart__item__content, price) {
    const divSettings = document.createElement("div")
    divSettings.classList = "cart__item__content__settings"
    cart__item__content.appendChild(divSettings)

    const cart__item__content__settings = document.querySelectorAll(".cart__item__content__settings")[i]
    const divQuantity = document.createElement("div")
    divQuantity.classList = "cart__item__content__settings__quantity"
    cart__item__content__settings.appendChild(divQuantity)
    const quantity_paragraph = document.createElement("p")
    quantity_paragraph.innerHTML = "Quantité :"
    divQuantity.appendChild(quantity_paragraph)

    displayQuantity(divQuantity, parsedItem, price)
    displayDeleteButton(i, cart__item__content__settings)
}

function displayQuantity(divQuantity, parsedItem, price) {
    let quantity = document.createElement("input")
    quantity.type = "number"
    quantity.classList = "itemQuantity"
    quantity.name = "itemQuantity"
    quantity.min = "1"
    quantity.max = "100"
    quantity.value = parsedItem.quantity
    divQuantity.appendChild(quantity)

    updatePrice(quantity, price, parsedItem)
    // let totalQuantity = document.querySelector("#totalQuantity")
    // parsedItem.forEach(element => {
    //     const totalPrice = element.quantity * element.price
    //     console.log(totalPrice);
    // }); 
}

function updatePrice(quantity, price, parsedItem) {
    price.innerHTML = "Prix : " + quantity.value * parsedItem.price + " €"
    quantity.addEventListener('change', function () {
        price.innerHTML = "Prix : " + quantity.value * parsedItem.price + " €"
    })
}

function displayDeleteButton(i, cart__item__content__settings) {
    const divDelete = document.createElement("div")
    divDelete.classList = "cart__item__content__settings__delete"
    cart__item__content__settings.appendChild(divDelete)
    const cart__item__content__settings__delete = document.querySelectorAll(".cart__item__content__settings__delete")[i]
    const deleteButton = document.createElement("p")
    deleteButton.classList = "deleteItem"
    deleteButton.innerHTML = "Supprimer"
    cart__item__content__settings__delete.appendChild(deleteButton)
}

function loopOverLocalStorage() {
    let cart = []
    for (let i = 0; i < localStorage.length; i++) {
        const getItem = localStorage.getItem(localStorage.key(i));
        const parsedItem = JSON.parse(getItem)
        displayImage(parsedItem, i)
        displayDescription(parsedItem, i)
        cart.push(parsedItem)
    }
    console.log(cart);
}

loopOverLocalStorage()






