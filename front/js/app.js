console.log('hello');
const itemsContainer = document.querySelector(".items");
const API_URL = `http://localhost:3000/api/products`;

// ===================================
// Calling the API and passing the received datas into the showProducts function's parameter
apiCall(API_URL);

function apiCall(url) {
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        showProducts(data)
    })
    .catch((err) => alert(err))
}

// =======================================================================
// For each Object in the API, creating a new HTML element with all it's informations 
// and append it to it's container
function showProducts(data) {
    data.forEach(product => {
            
        const {altTxt, description, imageUrl, name, _id} = product;//!!!
        let productUrl = `./product.html?id=${_id}`;
        const productElement = document.createElement('div');
        productElement.classList.add("item");
        productElement.innerHTML = `
        <a href="${productUrl}">
            <article>
                <img src="${imageUrl}" alt="${altTxt}">
                <div class="product-description">
                    <h3 class="productName">${name}</h3>
                    <p class="text-description">${description}</p>
                </div>
            </article>
        </a>`;
    
        itemsContainer.appendChild(productElement);
    })
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
