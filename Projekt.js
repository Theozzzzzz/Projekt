let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart')
let iconCartSpan = document.querySelector('.icon-cart span')

let listProducts = [];
let carts = {};

iconCart.addEventListener('click', () =>{
    body.classList.toggle('showCart')
})

closeCart.addEventListener('click', () =>{
    body.classList.toggle('showCart')
})

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct  = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML =`
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">${product.price}kr</div>
                <button class="addCart">
                    Add To Cart
                </button>
            `;
            listProductHTML.appendChild(newProduct);        

        })
    }
}

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id)
    }
})

let quantity = 0;
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    console.log("Position in Cart:", positionThisProductInCart);  // Debug log
    if (carts.length <= 0) {
        carts = [{product_id: product_id, quantity: 1}];
    } else if (positionThisProductInCart < 0) {
        carts.push({product_id: product_id, quantity: 1});
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
    
    localStorage.setItem('cart', JSON.stringify(listCart))
};
const addCartToMemory = () => {
    let test = JSON.parse(localStorage.getItem('cart')).append( { product_id, quantity } )
    localStorage.setItem('cart', JSON.stringify(test));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;  // Correct calculation of total quantity
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex(value => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            
            if (!info) {
                console.error("Product info not found for ID:", cart.product_id);
                return; // Skip this cart item if product info is missing
            }

            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    ${info.price * cart.quantity}kr
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
            listCartHTML.appendChild(newCart);
        });
    }
    iconCartSpan.innerHTML = totalQuantity; // Ensure this updates every time the function runs
}


// Listening for clicks on the cart list
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    // Using closest to find the nearest parent element with 'data-id', more reliable if the HTML structure is complex
    let product_id = positionClick.closest('.item').dataset.id; // Assuming '.item' is the class of the div that holds the product ID
    let type;

    if (positionClick.classList.contains('minus')) {
        type = 'minus';
    } else if (positionClick.classList.contains('plus')) {
        type = 'plus';
    }

    if (type) {
        changeQuantity(product_id, type);
    }
});

const changeQuantity = (product_id, type) => {
    let positionItemProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (positionItemProductInCart >= 0) {
        switch (type) {
            case 'plus':
                carts[positionItemProductInCart].quantity += 1;
                break;
            case 'minus':
                let valueChange = carts[positionItemProductInCart].quantity - 1;
                if (valueChange > 0) {
                    carts[positionItemProductInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemProductInCart, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML();
};

const initApp = () =>{
    // get data from json
    fetch('Projektiteminfo.json').then(response => response.json()).then(data => {
        listProducts = data;

        // get cart from memory 
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'))
            addDataToHTML();
        }
    })
}
initApp();