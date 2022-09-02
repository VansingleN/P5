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

function showImage(res) {

    const item__img = document.querySelector(".item__img");
    const image = document.createElement("img")
    image.classList = "productImage"
    image.src = res.imageUrl
    image.alt = res.altTxt
    item__img.appendChild(image)
    return res
}

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

function showDescription(res) {

    const description = document.querySelector("#description")
    description.innerHTML = res.description
    return res
}

function showColors(res) {

    res.colors.forEach(color => {
        const colors = document.querySelector("#colors")
        const option = document.createElement("option")
        option.value = color
        option.text = color
        colors.appendChild(option)
    })
}

function validatingCartAndStoringValues() {

    const addToCart = document.querySelector("#addToCart")
    addToCart.addEventListener("click", () => {

        const color = document.querySelector("#colors").value
        const quantity = document.querySelector("#quantity").value
        const id = window.location.search
        const urlSearchParams = new URLSearchParams(id)
        const paramId = urlSearchParams.get("id")
        // let price = document.querySelector("#price").innerHTML * quantity
        const item__img = document.querySelector(".productImage").src
        const name = document.querySelector("#title").innerHTML

        const values = {
            image: item__img,
            id: paramId,
            // price: price,
            color: color,
            quantity: Number(quantity),
            name: name,
        }
        const idc = paramId + color

        if (color == "" || quantity == 0) {
            alert('Please choose a color and a quantity')
        }

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

getDataFromId()
validatingCartAndStoringValues()


