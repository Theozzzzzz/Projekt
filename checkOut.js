const phone = document.getElementById("phone-input")
const verifyPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/; // jag hittade denna på internet https://ihateregex.io/expr/phone/

phone.addEventListener("focusout", (event) => {
    const result = verifyPhone.test(phone.value)
    if (result) {
        phone.style.border = "3px solid lime";
    } else {
        phone.style.border = "3px solid red";
    }
})

let listCart = [];
let productData = []

function checkCart() {
    var cookieValue = localStorage.getItem("cart");
    console.log("Loaded cart data from localStorage:", cookieValue); // Denna bör visa JSON-strängen eller undefined

    if (cookieValue) {
        listCart = JSON.parse(cookieValue);
        console.log("Parsed cart data:", listCart); // Denna loggar den parsaade arrayen
    } else {
        console.log("No cart data found in localStorage.");
    }
}

checkCart()


function addCartToHTML(){
    // Clear data from HTML
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';
    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.getElementById('totalprice');

    let totalQuantity = 0;
    let totalPrice = 0;
    
    // if has product in cart
    if(listCart){
        listCart.forEach(cart_item => {
            const product = productData.find((productItem) => productItem.id == cart_item.product_id)
            if(product){
                let newP = document.createElement('div');
                newP.classList.add('item')
                newP.innerHTML = `
                <img src="${product.image}" alt="">
                <div class="info">
                    <div class="name">${product.name}</div>
                    <div class="price">${product.price}</div>
                </div>
                <div class="quantity">${cart_item.quantity}</div>
                <div class="returnPrice">
                    ${product.price * cart_item.quantity}kr
                </div>`;
                listCartHTML.appendChild(newP);
                totalQuantity = totalQuantity + cart_item.quantity;
                totalPrice = totalPrice + (product.price * cart_item.quantity);
            }
        })
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = totalPrice + 'kr';
}

const initApp = async () =>{
    // få data från JSON, await används här för att vänta på att json filen kommmer, den ska inte blocka resten av koden. 
    await fetch('Projektiteminfo.json').then(response => response.json()).then(data => {
        productData = data;
    })
}
initApp().then(() => {
    addCartToHTML();
})