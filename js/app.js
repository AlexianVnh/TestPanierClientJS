/* ---------- */
/* DATA MODEL */
/* ---------- */


const productList = [{ id: 0, name: "Brosse à cheveux", price: 19.90 },
                    { id: 1, name: "Peigne", price: 3.80 },
                    { id: 2, name: "Gel coiffant", price: 3.90 },
                    { id: 3, name: "Élastiques à cheveux", price: 1.90 },
                    { id: 4, name: "Ciseaux de coiffeur", price: 10.00 },
                    { id: 5, name: "Tondeuse", price: 23.90 },
                    { id: 6, name: "Sèche-cheveux", price: 69.90 }]


function productExists(product) {
    return product >= 0 && product < productList.length
}

function addProductToCart(cart, product, quantity) {
    if (productExists(product) && quantity > 0 ) {
        if (cart.hasOwnProperty(product)) {
            cart[product] = cart[product] + parseFloat(quantity)
            return true
        }
        else {
            cart[product] = quantity
            return true
        }
    }

    return false
}

function cleanCart(cart){
    Object.keys(cart).forEach(key => delete cart[key]);
}

function computeCartPrice(cart) {
    let amount = 0
    for (const product in cart) {
        amount = amount + productList[product].price * cart[product]
    }

    return amount
}


/* --------- */
/* RENDERING */
/* --------- */

//Render Products list
function renderCartProductsAsNode(cart){
    let cartProductsClass = document.querySelector(".cart_products"); // Récupérer la classe du conteneur de produits

    // Si la classe n'existe pas, la créer
    if (!cartProductsClass) {
        const cartCont = document.querySelector(".cart"); // On récupère le container

        cartProductsClass = document.createElement("div");
        cartProductsClass.classList.add("cart_products"); // ajout de la classe
        cartCont.appendChild(cartProductsClass);
    } else {
        // Si elle existe, supprimer son contenu actuel
        while (cartProductsClass.firstChild) {
            cartProductsClass.removeChild(cartProductsClass.firstChild);
        }
    }

    for (const productItem in cart) {
        const prodName = productList[productItem].name;
        const prodQty = cart[productItem];
        
        const oneCartLineClass = document.createElement("div");
        oneCartLineClass.classList.add("one_cart_line"); // ajout de la classe
        cartProductsClass.appendChild(oneCartLineClass);

        const cartProdTitle = document.createElement("div");
        cartProdTitle.classList.add("cart_prod_title"); // ajout de la classe
        cartProdTitle.innerHTML = prodName;
        oneCartLineClass.appendChild(cartProdTitle);
    
        const cartProdQty = document.createElement("div");
        cartProdQty.classList.add("cart_prod_qty"); // ajout de la classe
        cartProdQty.innerHTML = "Qté : " + prodQty;
        oneCartLineClass.appendChild(cartProdQty);       
    }
}

//Render Total amount
function renderCartAmountAsNode(cart){
    let cartAmountClass = document.querySelector(".cart_amount"); // Récupérer la classe du conteneur du montant total

    // Si la classe n'existe pas, la créer
    if (!cartAmountClass) {
        const cartCont = document.querySelector(".cart"); // On récupère le container
        cartAmountClass = document.createElement("div");
        cartAmountClass.classList.add("cart_amount"); // ajout de la classe
        
        cartCont.appendChild(cartAmountClass);
    }

    // Calculer et afficher le prix total
    cartAmountClass.innerText = computeCartPrice(cart).toFixed(2) + " €"; // ajout du texte

}


//Render cart's product list and total amount as node
function renderCartAsNode(cart){
    let cartProductsAndAmount = document.createElement("div")
    cartProductsAndAmount.setAttribute("class", "cart_products_and_amount")

    let cartProducts = renderCartProductsAsNode(cart)
    let cartAmount = renderCartAmountAsNode(cart)

    if(cartProducts !== undefined)
        cartProductsAndAmount.append(cartProducts)
    if(cartAmount !== undefined)
        cartProductsAndAmount.append(cartAmount)

    return cartProductsAndAmount
}

// Update the whole cart
function updateCartRender(cart){
    let cartNode = document.querySelector(".cart")
    let oldCartProductsAndAmount = document.querySelector(".cart_products_and_amount")
    
    // Remove and replace by newly calculated cart
    if(oldCartProductsAndAmount != null){
        cartNode.removeChild(oldCartProductsAndAmount)
        console.log("removed")
    }

    cartNode.prepend(renderCartAsNode(cart))
}

/* ------------ */
/* INTERACTIONS */
/* ------------ */

let allAddProdButtons = document.querySelectorAll(".add_product")
let emptyCartButton = document.querySelector(".cart_prod_del")

//Cart by default - contains 3 units of product of ID 0
let cart = {0 : 3, 1 : 2}
updateCartRender(cart)

for(let addProdButton of allAddProdButtons){
    addProdButton.addEventListener("click", (event) =>{
        let buttonOrigin = event.target
        let buttonOriginDataId = buttonOrigin.getAttribute("data-id")
        let quantityInput = document.querySelector(".item_nb[data-id='" + buttonOriginDataId + "']")
        
        let quantityNb = parseFloat(quantityInput.value)

        addProductToCart(cart, buttonOriginDataId, quantityNb)
        updateCartRender(cart)
        console.log("Produit censé être ajouté : " + buttonOriginDataId + ", quantité : " + quantityNb)
    })
}

emptyCartButton.addEventListener("click", (event) =>{
    let cartClass = document.querySelector(".cart")
    let cartProductsClass = document.querySelector(".cart_products")
    let cartAmountClass = document.querySelector(".cart_amount")

    cartClass.removeChild(cartProductsClass)
    cartClass.removeChild(cartAmountClass)
    cart = {}
});


/* Ajouter les interactions
1. Compléter ensuite l’ajout des event listener sur les boutons ajouter au panier, à la fin du
fichier, pour permettre d’ajouter des produits dans le panier.
Au clic sur le bouton ajouter, il faudra :
a) Récupérer le bouton source de l’événement
b) Récupérer son attribut data-id grace à la fonction getAttribute(...)
c) Récupérer la valeur de l’<input> de même data-id (= la quantité de produits à ajouter)
d) Mettre à jour le panier sous forme de tableau associatif (la variable cart) grace à la fonction
addProductToCart()
e) Et enfin appeler la fonction updateCartRender(cart)
2. Tester la mise à jour du panier (avec différents produits et différentes quantités)
3. Puis compléter l’ajout des event listener sur le bouton supprimer.
Au clic il faudra :
a) Vider le panier sous forme de tableau associatif grace à la fonction cleanCart(cart)
b) Et enfin appeler la fonction updateCartRender(cart)
4. Tester le vidage du panier. */