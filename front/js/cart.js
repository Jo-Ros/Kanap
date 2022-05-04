// ==============================================================
const productsInCart =  JSON.parse(localStorage.getItem("products"));

const itemsContainer = document.querySelector('.cart-items');
const title = document.querySelector('h1');
const cartTotalPrice = document.querySelector('#totalPrice');
const cartTotalDiv = document.querySelector('.cart__price');
const form = document.querySelector('.cart-order-form');

// ==============================================================
// If localStorage is populated, for each presents object, call the api and pass the received
// data into functions parameter one after another. Each Function returns parameters, passing them
// to the next one ('cascading')
if(productsInCart) {
  productsInCart.forEach(object => {
    fetch(`http://localhost:3000/api/products/${object.id}`)
        .then((res) => res.json())
        .then((data) => totalItemPrice(data, object))
        .then(({ calculTotalPrice, data, object }) => showProductRow(calculTotalPrice, data, object))
        .then((object) => deleteProductOnClickEvent (object))
        .then((object) => changeProductQuantityOnChangeEvent(object))
        .catch((err) => alert(err))
  })
} else { // If the localStorage is empty, show nothing but a message on the page
        title.innerText = 'Your Cart Is Empty.';
        cartTotalPrice.style.display = 'none';
        form.style.display = 'none';
        cartTotalDiv.style.display = 'none';
}

// Calculating the price of each individual item based on the price received form the API,
// and the quantity based on the object from the localStorage
function totalItemPrice(data, object) {
  const calculTotalPrice =  data.price * object.quantity;

  return { calculTotalPrice, data, object };
};

// ===============================================================
// For each object, we create a new row ('article'), and passing the informations retrieved, 
// into variables and append it to its container
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
                    max="100" value="${object.quantity}" data-quantity="${object.quantity}">
                </div>  
            </div>
               
            <div class="cart-item-settings">

            <h3 class="item-total-price">Total Price: ${calculItemPrice} €</h3> 
                            
                <div class="cart-item-delete">
                  <p class="delete-item" data-delete="${object.id}" data-color="${object.color}">Delete</p>
                </div>

            </div>
          </div>`;

    itemsContainer.appendChild(productRow);
    
    computeTotalCartPrice(calculItemPrice); //Update 
    return object;
}

// ===============================================================
// Attach a click event to the button
function deleteProductOnClickEvent (object) {
  const btn = document.querySelector(`[data-delete="${object.id}"]`);
      
        btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // On click we splice (delete), the item from the array, update the localStorage and
        // refresh the page
        for(const [i, value] of productsInCart.entries()) {
          if(value.id === object.id && value.color === object.color) {
            
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
  const changeQuantity = document.querySelector(`[data-quantity="${object.quantity}"]`);  /// !!!!!!!!!!!!!!
   
    changeQuantity.addEventListener('change', (e) => {
      e.preventDefault();
  
      for(const [i, value] of productsInCart.entries()) {
        if(value.id === object.id && value.color === object.color) {
          
          productsInCart[i].quantity = e.target.value;
          localStorage.setItem("products", JSON.stringify(productsInCart));
          location.reload();
        }
      }
    })   

  return object;
}

// ===============================================================
// Creating a new Array that we'll populate with prices from our objects in the localStorage
let priceArray = [];

function computeTotalCartPrice(calculItemPrice) {

  priceArray.push(calculItemPrice);

  // Add each price in the array one after another
  const totalPrice = priceArray.reduce((sum, value) => {
    return sum += value;
  }, 0);

  // Append the result into it's HTML container
  cartTotalPrice.innerText = totalPrice;
}

// ==================== Form Validations ====================================
const submitOrder = document.querySelector('#order');

// Creating Regular Expressions
const nameRegex = /^[a-zA-Z\-çñàéèêëïîôüù]{2,}$/;
const addressRegex = /^[0-9a-zA-Z\s,.'-çñàéèêëïîôüù]{3,}$/;
const emailRegex = /^[A-Za-z0-9\-\.]+@([A-Za-z0-9\-]+\.)+[A-Za-z0-9-]{2,4}$/;

const firstName = document.querySelector('#firstName');
const lastName = document.querySelector('#lastName');
const address = document.querySelector('#address');
const city = document.querySelector('#city');
const email = document.querySelector('#email');

// Test the informations written by the user, using our RegEx,
// if the input is not valid based on the RegEx, or if the field is empty,
// a message will appear until corrected.

// == FirstName validation ==
firstName.addEventListener("input", () => {
  if (nameRegex.test(firstName.value) === false || firstName.value === "") {
    document.getElementById("firstNameErrorMsg").innerText = "Unvalid field, please use more than one charater and/or no numbers :)";
  } else {
    document.getElementById("firstNameErrorMsg").innerHTML = "";
  }
});

// == LastName validation == 
lastName.addEventListener("input", () => {
  if (nameRegex.test(lastName.value) === false || lastName.value === "") {
    document.getElementById("lastNameErrorMsg").innerHTML = "Unvalid field, please use more than one charater and/or no numbers :)";
  } else {
    document.getElementById("lastNameErrorMsg").innerHTML = "";
  }
});

// == Address validation == 
address.addEventListener("input", () => {
  if (addressRegex.test(address.value) === false || address.value === "") {
    document.getElementById("addressErrorMsg").innerHTML = "Unvalid field, please use more than three charcters :)";
  } else {
    document.getElementById("addressErrorMsg").innerHTML = "";
  }
});

// == City validation == 
city.addEventListener("input", () => {
  if (nameRegex.test(city.value) === false || city.value === "") {
    document.getElementById("cityErrorMsg").innerHTML = "Unvalid field, please use more than one charater and/or no numbers :)";
  } else {
    document.getElementById("cityErrorMsg").innerHTML = "";
  }
});

// == email validation == 
email.addEventListener("input", () => {
  if (emailRegex.test(email.value) === false || email.value === "") {
    document.getElementById("emailErrorMsg").innerHTML = "Unvalid field, try it again based on this example: 'johndoe@email.com' :)";
  } else {
    document.getElementById("emailErrorMsg").innerHTML = "";
  }
});

// =============================================================
// Attach a click event on "Order Now !" button
submitOrder.addEventListener('click', (e) => {
  e.preventDefault();
  
  // onclick, creating a new Array that we populate with ids present in the localStorage
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

  // If all the criterias are Ok, then we create a new object which contains a contact object
  // (populated with the user's infos) and the array of prices
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

    // Then we Post the newOrder object to the API
    fetch("http://localhost:3000/api/products/order", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newOrder)
    })
    // The API send us a response, that we use to retreive the orderId
    // which we use as a variable in the link to be redirected on the confirmation page
    // when everything is ok 
        .then((res) => res.json())
        .then((confirm) => {
            location.href = "./confirmation.html?orderId=" + confirm.orderId;
            localStorage.clear();
        })
        .catch((err) => console.log(err))
  }
});

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