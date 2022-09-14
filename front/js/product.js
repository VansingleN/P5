// Récupération des données du produit se référant à l'ID de l'URL
function getDataFromId() {

    const id = window.location.search
    const urlSearchParams = new URLSearchParams(id)
    const paramId = urlSearchParams.get("id")
    fetch(`http://localhost:3000/api/products/${paramId}`)
        .then((res) => res.json())
        .then((res) => showImage(res))
        .then(showTitleAndPrice)
        .then(showDescription)
        .then(showColors)
}

// Fabrication de la balise image et appel de sa source (depuis l'API)
function showImage(res) {

    const item__img = document.querySelector(".item__img");
    const image = document.createElement("img")
    image.classList = "productImage"
    image.src = res.imageUrl
    image.alt = res.altTxt
    item__img.appendChild(image)
    return res
}

// Ajout du titre du produit ainsi que de son prix modifiable selon sa quantité (depuis l'API)
function showTitleAndPrice(res) {

    const title = document.querySelector("#title")
    title.innerHTML = res.name
    const price = document.querySelector("#price")
    const quantity = document.querySelector("#quantity")
    price.innerHTML = quantity.value * res.price
    quantity.addEventListener('change', function () {
        price.innerHTML = quantity.value * res.price
    })
    return res
}

// Ajout de la description du produit (depuis l'API)
function showDescription(res) {

    const description = document.querySelector("#description")
    description.innerHTML = res.description
    return res
}

// Ajout de la couleur du produit (depuis l'API)
function showColors(res) {

    res.colors.forEach(color => {
        const colors = document.querySelector("#colors")
        const option = document.createElement("option")
        option.value = color
        option.text = color
        colors.appendChild(option)
    })
}

// Ajout du produit dans le panier et stockage de ses valeurs dans le localStorage
function validatingCartAndStoringValues() {

    const addToCart = document.querySelector("#addToCart")
    addToCart.addEventListener("click", () => {

        const color = document.querySelector("#colors").value
        const quantity = document.querySelector("#quantity").value
        const id = window.location.search
        const urlSearchParams = new URLSearchParams(id)
        const paramId = urlSearchParams.get("id")
        const item__img = document.querySelector(".productImage").src
        const name = document.querySelector("#title").innerHTML

        const values = {
            image: item__img,
            id: paramId,
            color: color,
            quantity: Number(quantity),
            name: name,
        }
        const idc = paramId + color

// Ici une alerte en cas de panier vide
        if (color == "" || quantity == 0) {
            alert('Please choose a color and a quantity')
        }

/* Ci-dessous on permet à l'utilisateur de d'ajouter une quantité d'un même produit depuis la page produit
en vérifiant s'il existe déjà dans le localStorage et en incrémentant si nécessaire */
        else {
            let json = localStorage.getItem(idc)

            if (json != null) {
                currentValue = JSON.parse(json)
            } else {
                currentValue = undefined
            }
            if (currentValue == undefined) {
                localStorage.setItem(idc, JSON.stringify(values))
            }
            else {
                currentValue.quantity = currentValue.quantity + values.quantity
                localStorage.setItem(idc, JSON.stringify(currentValue))
            }
        }
    })
}

// Appels des deux fonctions principales
getDataFromId()
validatingCartAndStoringValues()


