// ==============================================================
const productsInCart =  JSON.parse(localStorage.getItem("products"));

const itemsContainer = document.querySelector('.cart-items');
const title = document.querySelector('h1');
const cartTotalPrice = document.querySelector('#totalPrice');
const cartTotalDiv = document.querySelector('.cart__price');
const form = document.querySelector('.cart-order-form');

// ==============================================================
if(productsInCart) {
  productsInCart.forEach(object => {
    fetch(`http://localhost:3000/api/products/${object.id}`)
        .then((res) => res.json())
        .then((data) => totalItemPrice(data, object))
        .then(({calculTotalPrice, data, object}) => showProductRow(calculTotalPrice, data, object))
        .then((object) => deleteProductOnClickEvent (object))
        .then((object) => changeProductQuantityOnChangeEvent(object))
        .catch((err) => alert(err))
  })
} else {
        title.innerText = 'Your Cart Is Empty.';
        cartTotalPrice.style.display = 'none';
        form.style.display = 'none';
        cartTotalDiv.style.display = 'none';
}

  function totalItemPrice(data, object) {
    const calculTotalPrice =  data.price * object.quantity;

    return {calculTotalPrice, data, object};
};

// ===============================================================
function showProductRow(calculItemPrice, data, object) {

    const productRow = document.createElement('article');
    productRow.classList.add('cart-item');
    productRow.setAttribute('data-id', `${object.id}`);
    productRow.setAttribute('data-color', `${object.color}`);

    productRow.innerHTML = `
          <div class="cart-item-img">
            <img src="${data.imageUrl}" alt="${data.altTxt}">
          </div>
                      
          
            <div class="cart-item-description">
              <h2>${data.name}</h2>
              <p class="item-color-text">${object.color}</p> 
                  
              <div class="cart-item-quantity">
                  <p>Quantity: </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" 
                    max="100" value="${object.quantity}">
                </div>  
            </div>
               
            <div class="cart-item-settings">

            <h3 class="item-total-price">Total Price: ${calculItemPrice} €</h3> 
                            
                <div class="cart-item-delete">
                  <p class="delete-item-${object.id}" data-id="${object.id}" data-color="${object.color}">Delete</p>
                </div>

            </div>
          </div>`;

    itemsContainer.appendChild(productRow);
    
    computeTotalCartPrice(calculItemPrice);
    return object;
}

// ===============================================================

function deleteProductOnClickEvent (object) {
  const btn = document.querySelector(`.delete-item-${object.id}`);
    

      
        btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        for(const [i, v] of productsInCart.entries()) {
          if(v.id === object.id && v.color === object.color) {
            
            productsInCart.splice(i, 1);
            localStorage.setItem("products", JSON.stringify(productsInCart));
            location.reload();
          }
        }

        // == Reset Local Storage if empty ==
        if(productsInCart === null || productsInCart.length === 0){
            localStorage.clear();
            location.reload();
        }
      })
  
    return object;
}

// ===============================================================
function changeProductQuantityOnChangeEvent(object) {
  const changeQuantity = document.querySelectorAll('.itemQuantity');
  
  changeQuantity.forEach((btn) => {
   
    btn.addEventListener('change', (e) => {
      e.stopImmediatePropagation();
  
      for(const [i, v] of productsInCart.entries()) {
        if(v.id === object.id && v.color === object.color) {
          
          productsInCart[i].quantity = e.target.value;
          localStorage.setItem("products", JSON.stringify(productsInCart));
          location.reload();
        }
      }
    })   
  })
  return object;
}

// ===============================================================
let priceArray = [];

function computeTotalCartPrice(calculItemPrice) {

  priceArray.push(calculItemPrice);

  const totalPrice = priceArray.reduce((sum, value) => {
    return sum += value;
  }, 0);

  cartTotalPrice.innerText = totalPrice;
}

// ==================== Form Validations ====================================
const submitOrder = document.querySelector('#order');

const nameRegex = /^[a-zA-Z\-çñàéèêëïîôüù]{2,}$/;
const addressRegex = /^[0-9a-zA-Z\s,.'-çñàéèêëïîôüù]{3,}$/;
const emailRegex = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,4}$/;

const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');

// == FirstName validation ==
firstName.addEventListener("input", () => {
  if (nameRegex.test(firstName.value) === false || firstName.value === "") {
    document.getElementById("firstNameErrorMsg").innerText = "Unvalid first name :/";
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
  }
});

// == LastName validation == 
lastName.addEventListener("input", () => {
  if (nameRegex.test(lastName.value) === false || lastName.value === "") {
    document.getElementById("lastNameErrorMsg").innerHTML = "Unvalid name :/";
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
  }
});

// == Address validation == 
address.addEventListener("input", () => {
  if (addressRegex.test(address.value) === false || address.value === "") {
    document.getElementById("addressErrorMsg").innerHTML = "Unvalid address :/";
  } else {
    document.getElementById("addressErrorMsg").innerHTML = "";
  }
});

// == City validation == 
city.addEventListener("input", () => {
  if (nameRegex.test(city.value) === false || city.value === "") {
    document.getElementById("cityErrorMsg").innerHTML = "Unvalid city :/";
  } else {
    document.getElementById("cityErrorMsg").innerHTML = "";
  }
});

// == email validation == 
email.addEventListener("input", () => {
  if (emailRegex.test(email.value) === false || email.value === "") {
    document.getElementById("emailErrorMsg").innerHTML = "Unvalid email :/";
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
  }
});

// =============================================================
// Post object and array API
submitOrder.addEventListener('click', (e) => {
  e.preventDefault();
  
  const products = [];
  productsInCart.forEach((item) => {
    products.push(item.id);
  })

  //const isFirstnameValueNotEmpty = firstname.value !== undefined && firstname.value !== '';
  if(firstName.value === "" ||
     lastName.value === "" ||
     address.value === "" ||
     city.value === "" ||
     email.value === "") 
     { alert("Please fill all the fields :)") }
    
  
  else if(
    nameRegex.test(firstName.value) === false ||
    nameRegex.test(lastName.value) === false ||
    nameRegex.test(city.value) === false ||
    addressRegex.test(address.value) === false ||
    emailRegex.test(email.value) === false) 
    { alert("We need correct informations to go further! :)") }

  else {
    const newOrder = {
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      },
      products
    }

    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    })
        .then((res) => res.json())
        .then((confirm) => {
            location.href = "./confirmation.html?orderId=" + confirm.orderId;
            localStorage.clear();
        })
        .catch((err) => console.log(err))
  }
});