// Utilisation de fetch pour récupérer le tableau de produits depuis l'API
function getProductsFromBackend() {
      
      fetch('http://localhost:3000/api/products')
            .then((res) => res.json())
            .then((res) => showProducts(res))
}

// Initialisation de la boucle for of afin de parcourir le tableau
function showProducts(products) {

      for (product of products) {
            displayProduct(product)
      }
}

// Fabrication et placement des produits en fonction de leur place dans le tableau
function displayProduct(product) {

      const items = document.querySelector("#items")
      const id = product._id
      const anchor = document.createElement("a")
      anchor.href = "./product.html?id=" + id
      const article = document.createElement("article")
      const imageUrl = product.imageUrl
      const image = document.createElement("img")
      image.src = imageUrl
      image.alt = product.altTxt
      const title = document.createElement("h3")
      title.innerHTML = product.name
      title.classList = "productName"
      const paragraph = document.createElement("p")
      paragraph.classList = "productDescription"
      paragraph.innerHTML = product.description

      items.appendChild(anchor)
      anchor.appendChild(article)
      article.appendChild(image)
      article.appendChild(title)
      article.appendChild(paragraph)
}

// Appel de la fonction initiale
getProductsFromBackend()



