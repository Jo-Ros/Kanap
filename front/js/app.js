console.log('hello');
const itemsContainer = document.querySelector(".items");
const API_URL = `http://localhost:3000/api/products`;

// ===================================
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
function showProducts(data) {
    data.forEach(product => {
            
        const {altTxt, description, imageUrl, name, _id} = product;
        let productUrl = `./product.html?id=${_id}`;
        console.log(productUrl);
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

const menuOpener = document.querySelector(".mobile-cta");
const menuNav = document.querySelector('.primary-nav');
const menuClose = document.querySelector(".mobile-exit");

menuOpener.addEventListener('click', () => {
    menuNav.style.display = "inherit";
    menuOpener.style.display = "none";
})

menuClose.addEventListener('click', () => {
    menuNav.style.display = "none";
    menuOpener.style.display = "inherit";
})