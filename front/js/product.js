console.log('hello');
const itemContainer = document.querySelector('.item-container');
const pageTitle = document.querySelector('title');
const currentProductId = location.search.substring(4);
const productUrl = `http://localhost:3000/api/products/${currentProductId}`;
console.log(currentProductId);

// =========== Get data from API ===========
apiCall(productUrl);

function apiCall(url) {
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        showProduct(data)
        chooseItem(data)
    })
    .catch((err) => alert(err))
}

// ============ Show the product ============
function showProduct(data) {
        pageTitle.innerText = `${data.name}`
        const productInfos = document.createElement('article');
        productInfos.innerHTML = `
            
            <div class="item-content">

                <div class="item-img"> <img src="${data.imageUrl}" alt="${data.altTxt}"> </div>

                <div class="product-description">

                    <div class="item__content__description">
                        <h1 id="title">${data.name}</h1> 
                        <p id="description">${data.description}</p>
                        <p class="price">Price : <span id="price">${data.price}</span>€</p>
                    </div>

                    <div class="item__content__settings">
                        <div class="item__content__settings__color">
                        <label for="color-select">Choisir une couleur :</label>
                        <select name="color-select" id="colors">
                            ${data.colors.map(
                                (color) => "<option value=" + color + ">" + color + "</option>"
                            )}
                        </select>
                        </div>

                        <div class="item__content__settings__quantity">
                        <label for="itemQuantity">Nombre d'article(s) :</label>
                        <input type="number" name="itemQuantity" min="1" max="100" value="1" id="quantity">
                        </div>
                    </div>

                    <div class="item__content__addButton">
                        <button id="addToCart">Ajouter au panier</button>
                    </div>
                
                </div>

            </div>`;
            
            itemContainer.appendChild(productInfos);
}

// ==== Choose color/ quantity and send new object to localStorage ====
function chooseItem(data) {
    const addToCartBtn = document.querySelector('#addToCart');
    const colors = document.querySelector('#colors');
    const quantity = document.querySelector('#quantity');

    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let chosenColor = colors.value;
        let quantityAdded = quantity.value;

        let chosenProduct = {
            name: `${data.name}`,
            id: `${currentProductId}`,
            color: chosenColor,
            quantity: quantityAdded
        }
        setInCart(chosenProduct);
        
        // == Redirection ==
        let confirmationText = "This product has been added to your cart! :) \nWould you like to see it now?";
        if(confirm(confirmationText) == true) {
            location.href = "./cart.html";
        }   else {
            location.href = "./index.html";
        }
    })
}

function setInCart(chosenProduct) {
    let productsInCart =  JSON.parse(localStorage.getItem("products"));

    if(productsInCart) {
        for(const [i, v] of productsInCart.entries()) {

            if(chosenProduct.id === v.id && chosenProduct.color === v.color) {
                productsInCart[i].quantity = parseInt(v.quantity) + parseInt(chosenProduct.quantity);
                localStorage.setItem("products", JSON.stringify(productsInCart));
                return;
            }
        }
        productsInCart.push(chosenProduct);
        localStorage.setItem("products", JSON.stringify(productsInCart));
    } else {
        productsInCart = [];
        productsInCart.push(chosenProduct);
        localStorage.setItem("products", JSON.stringify(productsInCart));
    }
}