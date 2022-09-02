function displayImage(parsedItem) {
    const cart__item__img = document.querySelector(".cart__item__img")
    const image = document.createElement("img")
    image.src = parsedItem.image
    cart__item__img.appendChild(image)
}

function displayDescription(parsedItem, i, cart) {
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
    price.classList = "pagePrices"

    

    cart__item__content__description.append(name, color, price)
    

    injectInputContainer(parsedItem, i, cart__item__content, price, cart)
}

function injectInputContainer(parsedItem, i, cart__item__content, price, cart) {
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

    displayQuantity(divQuantity, parsedItem, price, i, cart)
    displayDeleteButton(i, cart__item__content__settings)
}

function displayQuantity(divQuantity, parsedItem, price, i, cart) {
    let quantity = document.createElement("input")
    quantity.type = "number"
    quantity.classList = "itemQuantity"
    quantity.name = "itemQuantity"
    quantity.min = "1"
    quantity.max = "100"
    quantity.value = parsedItem.quantity
    divQuantity.appendChild(quantity)

    getPriceFromBackend(quantity, price, i, cart, parsedItem)
}

function getPriceFromBackend(quantity, price, i, cart, parsedItem) {
    fetch('http://localhost:3000/api/products')
        .then((res) => res.json())
        .then((res) => updatePrice(quantity, price, res, i, cart, parsedItem))
}

function updatePrice(quantity, price, res, i, cart, parsedItem) {
    price.innerHTML = quantity.value * res[i].price
    quantity.addEventListener('change', function () {
        price.innerHTML = quantity.value * res[i].price
    })
    
    calculatingTotalPrice(cart, i, res, parsedItem, quantity, price)
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
    
    
    for (let i = 0; i < localStorage.length; i++) {
        const getItem = localStorage.getItem(localStorage.key(i));
        const parsedItem = JSON.parse(getItem)
        cart.push(parsedItem)
        displayImage(parsedItem, i)
        displayDescription(parsedItem, i, cart)

    }
    console.log(cart);
}

function calculatingTotalPrice (cart, i, res, parsedItem, quantity, price) {
    const totalPriceContainer = document.querySelector("#totalPrice")
        totalPrice += parsedItem.quantity * res[i].price
        // console.log(parsedItem.quantity);
        // console.log(res[i].price);
        // console.log(totalPrice); 
    totalPriceContainer.innerHTML = totalPrice
    priceModification(i, res, parsedItem, quantity, totalPriceContainer, price)
}

function priceModification (i, res, parsedItem, quantity, totalPriceContainer, price) {
    // let pagePrices = document.querySelectorAll(".pagePrices")
    console.log(Number(price.innerHTML));
    
    let input = document.querySelectorAll(".pagePrices").forEach(e => { 
            // console.log(element.innerHTML);  
    quantity.addEventListener('change', function (event) {
        let value = event.target.value
        const cartProduct = cart.find(
            (element) =>
            element.id === parsedItem.id &&
            element.color === parsedItem.color
            )
            cartProduct.quantity = value
            console.log(cartProduct);
        let modifiedTotalPrice = 0
        // console.log(quantity.value);
        // console.log(modifiedTotalPrice);
        // totalPriceContainer.innerHTML = quantity.value * res[i].price
        modifiedTotalPrice += cart[i].quantity * e.innerHTML
        totalPriceContainer.innerHTML = modifiedTotalPrice
        // console.log(Number(price.innerHTML));
        console.log(Number(e.innerHTML));
    });
    })}

let totalPrice = 0

let cart = []
loopOverLocalStorage()



  var liste = []; //Liste finale
  var balises = document.getElementsByClassName('itemQuantity'); //Ici on utilise * pour toute les balises, mais si on cherchait que pour une balise en particulier ('a' par exemple), ça serait plus rapide car moins de balises à filtrer
  for( var i=0; i<balises.length; ++i)
  {
    var b = balises[i];
    if(b.className == 'itemQuantity')
      liste.push(b);
  }
  










