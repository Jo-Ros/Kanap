const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");

document.querySelector("#orderId").innerText = orderId;






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