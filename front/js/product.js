console.log('hello');
const itemContainer = document.querySelector('.item-container');
const pageTitle = document.querySelector('title');
const currentProductId = location.search.substring(4);
const productUrl = `http://localhost:3000/api/products/${currentProductId}`;
console.log(currentProductId);

// =========== Get data from API ===========
// Calling the API based on the URL's id and passing the received datas into the showProduct 
//and chooseItem function's parameter
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
// Creating a new HTML element based on the received datas, and append it to it's container
function showProduct(data) {
        pageTitle.innerText = `${data.name}`;
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
                        <label for="color-select">Pick a color</label>
                        <select name="color-select" id="colors">
                            ${data.colors.map(
                                (color) => "<option value=" + color + ">" + color + "</option>"
                            )}
                        </select>
                        </div>

                        <div class="item__content__settings__quantity">
                        <label for="itemQuantity">Quantity</label>
                        <input type="number" name="itemQuantity" min="1" max="100" value="1" id="quantity">
                        </div>
                    </div>

                    <div class="item__content__addButton">
                        <button id="addToCart">Add To Cart</button>
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

    // Append an eventListener on the button
    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Retrieve the user's choices for the color and quantity
        let chosenColor = colors.value;
        let quantityAdded = quantity.value;

        // Creating a new object populated with the current ID, the chosen color and quantity
        let chosenProduct = {
            //name: `${data.name}`,
            id: `${currentProductId}`,
            color: chosenColor,
            quantity: quantityAdded
        }
        // Pushing the Object in Local Storage, passing the Object into function's parameter
        setInCart(chosenProduct);
        
        // // == Redirection ==
        // let confirmationText = "This product has been added to your cart! :) \nWould you like to see it now?";
        // if(confirm(confirmationText) == true) {
        //     location.href = "./cart.html";
        // }   else {
        //     location.href = "./index.html#our-products";
        // }
    })
}

function setInCart(chosenProduct) {
    // Creating a variable to verify if localStorage is populated
    let productsInCart =  JSON.parse(localStorage.getItem("products"));

    if(productsInCart) {
        for(const [i, value] of productsInCart.entries()) {
            // If a product is already in cart with the same color and id => then:
            if(chosenProduct.id === value.id && chosenProduct.color === value.color) {
                productsInCart[i].quantity = parseInt(value.quantity) + parseInt(chosenProduct.quantity);
                localStorage.setItem("products", JSON.stringify(productsInCart));
                return;
            }
        }
        productsInCart.push(chosenProduct);
        localStorage.setItem("products", JSON.stringify(productsInCart));
    } else { // If localStorage is empty
        productsInCart = [];
        productsInCart.push(chosenProduct);
        localStorage.setItem("products", JSON.stringify(productsInCart));
    }
}

//========================= Menu DropDown =========================

const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');

menu.addEventListener('click', (e) => {
    e.preventDefault();

    menu.classList.toggle('active');
    nav.classList.toggle('mobile-view');
})

// ===
const mouseCursor  = document.querySelector('.cursor');

window.addEventListener('mousemove', cursor);

function cursor(e) {
    mouseCursor.style.top = e.pageY + 'px';
    mouseCursor.style.left = e.pageX + 'px';
}