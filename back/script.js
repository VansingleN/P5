fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    .then((res) => showProducts(res))

     



function showProducts(products) {

    

    for (product of products) {   
    

    const items = document.querySelector("#items")
    const id = product._id
    const anchor = document.createElement("a")
          anchor.href = "./product.html?id=" + id

    const article = document.createElement("article")

    const imageUrl = product.imageUrl
    const image = document.createElement("img")
          image.src = imageUrl
    const title = document.createElement("h3")
          title.innerHTML = product.name
    const paragraph = document.createElement("p")
          paragraph.classList = "productDescription"
          paragraph.innerHTML = product.description
          

    items.appendChild(anchor)
    anchor.appendChild(article)
    article.appendChild(image)
    article.appendChild(title)
    article.appendChild(paragraph)
    
}
    console.log(products)
}
    

