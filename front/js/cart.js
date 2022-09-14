// ----------------------DEBUT DE LA BOUCLE----------------------

/* Le localStorage est parcouru avec une boucle for afin de récupérer chaque produit selon sa clé et le mettre dans un tableau "cart".
On "parse" également le produit afin de travailler avec.
Chaque fonction qui suit est integré dans la boucle for, afin de fabriquer plusieurs balises en fonction du nombre de produits à afficher */
function loopOverLocalStorage() {
    for (let i = 0; i < localStorage.length; i++) {
        const getItem = localStorage.getItem(localStorage.key(i));
        const parsedItem = JSON.parse(getItem)
        cart.push(parsedItem)

        displayArticle(parsedItem, i)
    }
}

// Ajout de la balise article et de ses attributs, le "i" passé en argument sur les fonctions suivantes et notre itérateur de départ de la boucle for
function displayArticle(parsedItem, i) {
    const cart__item = document.createElement("article")
    cart__item.classList = "cart__item"
    cart__item.dataset.id = parsedItem.id
    cart__item.dataset.color = parsedItem.color
    const cart__items = document.querySelector("#cart__items")
    cart__items.appendChild(cart__item)

    displayImage(parsedItem, i, cart__item)
}

// Ajout de la balise image et de ses attributs
function displayImage(parsedItem, i, cart__item) {
    const div__cart__item__img = document.createElement("div")
    div__cart__item__img.classList = "cart__item__img"
    cart__item.appendChild(div__cart__item__img)
    const image = document.createElement("img")
    image.src = parsedItem.image
    div__cart__item__img.appendChild(image)

    displayDescription(parsedItem, i, cart__item)
}

// Ajout de la balise div (description) et de ses attributs, ainsi que le nom, la couleur et le prix
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

// Ajout des 2 balises "div" settings et quantity ainsi que leurs attributs
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

    /* Ici la "cascade de fonctions" prend 2 chemins différents, 
    pour ne pas les entremêler inutilement, avoir une meilleure visibilité et mieux définir les arguments nécessaires */
    displayDeleteButton(i, cart__item__content__settings, parsedItem)
    displayQuantity(divQuantity, parsedItem, price, i)
}

// Ajout de la balise "div" delete, ainsi que d'un eventListener sur le bouton pour activer la suppression
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

/* L'eventListener de suppression renvoie a cette liste de fonctions, qui suppriment l'élément du tableau "cart", du localStorage et du DOM, 
avant de mettre a jour la quantité et le prix affichés */
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

/* Ajout de la balise "input", permettant de choisir une quantité affichée depuis l'itération en cours du cart,
puis appel de la fonction permettant de mettre à jour le total de quantités du panier à l'aide de l'eventListener */
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

// Le prix n'ayant pas été stocké dans le localStorage pour des raisons de sécurité, on le récupère ici avec un nouveau fetch
function getPriceFromBackend(quantity, price, i, parsedItem) {
    fetch('http://localhost:3000/api/products')
        .then((res) => res.json())
        .then((res) => displayProductsIndividualPrices(quantity, price, res, i, parsedItem))
}

/* On récupère dans cette fonction le produit en cours d'itération dans le cart, puis on lui ajoute le prix récupéré ci-dessus.
Enfin, on affiche dans le DOM le prix des produits individuellement en multipliant leur quantité par leur prix */
function displayProductsIndividualPrices(quantity, price, res, i, parsedItem) {
    const productWithPriceFromBack = cart.find(product => product.id === parsedItem.id && product.color === parsedItem.color)
    productWithPriceFromBack.price = res.find(product => product._id === parsedItem.id).price
    price.innerHTML = "Prix : " + quantity.value * cart[i].price + " €"

    displayTotalCartPrice(parsedItem, i, quantity, price)
}

// On affiche ici le prix total du panier
function displayTotalCartPrice(parsedItem, i, quantity, price) {
    const totalPriceContainer = document.querySelector("#totalPrice")
    totalPrice += parsedItem.quantity * cart[i].price
    totalPriceContainer.innerHTML = totalPrice

// Les fonctions prennent à nouveau 2 chemins distincts pour des raisons de lisibilité et d'ergonomie
    displayTotalProductsQuantity()
    updateProductsIndividualPrices(quantity, price, i)
}

// Ajout d'un eventListener pour mettre à jour les prix individuels des produits en cas de changement de quantité
function updateProductsIndividualPrices(quantity, price, i) {
    quantity.addEventListener('change', function () {
        price.innerHTML = "Prix : " + quantity.value * cart[i].price + " €"
        
        updateTotalCartPrice()
    })
}

/* Mise à jour du prix total affiché du panier en cas de changement de quantité d'un produit
(fonction appelée dans l'eventListener précédent) */
function updateTotalCartPrice() {
    const totalPriceContainer = document.querySelector("#totalPrice")
    let modifiedTotalPrice = 0
    cart.forEach((p) => modifiedTotalPrice += (p.price * p.quantity))
    totalPriceContainer.innerHTML = modifiedTotalPrice
}

// Affichage du total de quantité des produits
function displayTotalProductsQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, parsedItem) => total + Number(parsedItem.quantity), 0)
    totalQuantity.innerHTML = total
}

/* Mise à jour du total de quantité de produits 
(fonction appelée dans l'eventListener de displayQuantity) */
function updateTotalProductsQuantity(id, color, quantityValue) {
    const productInCart = cart.find((product) => product.id === id && product.color === color)
    productInCart.quantity = Number(quantityValue)

// On appelle la 1ère fonction pour mettre à jour dans le localStorage et la seconde pour mettre à jour l'affichage du total de produits après modification
    updateProductQuantityInLocalStorage(productInCart, Number(quantityValue))
    displayTotalProductsQuantity()
}

// Mise à jour de la quantité du produit selectionné dans le localStorage afin de la conserver en cas de rafraichissement de la page
function updateProductQuantityInLocalStorage(productInCart, quantity) {
    const idc = productInCart.id + productInCart.color
    const productInStorage = localStorage.getItem(idc)
    const parsedProduct = JSON.parse(productInStorage)
    parsedProduct.quantity = quantity
    const stringifiedProduct = JSON.stringify(parsedProduct)
    localStorage.setItem(idc, stringifiedProduct)
}

// ----------------------FIN DE LA BOUCLE----------------------

// Les données saisies dans le formulaire sont récupérées puis vérifiées à l'aide de regex
function getContactAndVerify() {
    const order = document.querySelector("#order")
    order.addEventListener("click", (event) => {
// On utilise preventDefault pour éviter le rafraichissement automatique de la page
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
// Cette regex permet de vérifier l'absence de la plupart des symboles dans les données saisies
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
// Cette regex permet de vérifier qu'il y'a des caractères avant le "@", apres le "@", qu'un "." se trouve après le "@" et qu'il est suivi par d'autres caractères
        const emailVerification = /.+@.+\..+/
        if (emailVerification.test(contact.email) === false) {
            const emailErrorMsg = document.querySelector("#emailErrorMsg");
            emailErrorMsg.innerHTML = "Veuillez entrer une adresse mail valide"
        }
        else {
            emailErrorMsg.innerHTML = ""
        }
// Verification finale de la validité des tests, si incorrects, le code ne passe pas à la suite tant que l'erreur n'est pas corrigée dans le formulaire
        if (globalVerification.test(contact.firstName) === false || globalVerification.test(contact.lastName) === false || globalVerification.test(contact.address) === false || globalVerification.test(contact.city) === false || emailVerification.test(contact.email) === false)
            return
// On fabrique un tableau de produits comme demandé par l'API, dans lequel on ne met que les "id"
        let products = []
        for (i = 0; i < cart.length; i++) {
            products.push(cart[i].id)

        }
// Puis on frabrique un objet de commande avec les données utilisateur et les produits qu'il a commandé
        const order = {
            contact,
            products,
        }
        setupRequest(order)
    })
}

// Initialisation de la requète "POST" dans une constante
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

// Lancement de la requète "POST" vers l'API qui récupère les données, renvoie un "orderId" et redirige vers la page de confirmation
function postRequest(stringifiedOrder) {
    fetch("http://localhost:3000/api/products/order", stringifiedOrder)
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("orderId", data.orderId),
                document.location.href = "confirmation.html?id=" + data.orderId
        })
}

// Variable du prix total hors de la boucle afin de pouvoir la remettre a 0 à chaque recalcul
let totalPrice = 0
// Déclaration du cart en tant que tableau vide dans la portée globale
let cart = []
// Lancement de la première fonction
loopOverLocalStorage()
// Lancer de la première fonction concernant le formulaire
getContactAndVerify()