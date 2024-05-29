let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');
let foot = document.getElementById('footerDiv');
let cartTab = document.getElementById('cartTab')

let listProducts = [];
let carts = {};

document.addEventListener("DOMContentLoaded", function() {
    let sorter = document.getElementById('sorter');
    var svgElement = document.getElementById('sorter-btn');

    svgElement.addEventListener('click', function() {
        if (sorter.style.display === 'none') {
            sorter.style.display = 'flex';
        } else {
            sorter.style.display = 'none';
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    var dropdownButtons = document.querySelectorAll(".dropbtn");
    var dropdownContents = document.querySelectorAll(".dropdown-content");

    dropdownButtons.forEach((button, index1) => {
        button.addEventListener('click', function() {
            let dropdownContent = dropdownContents[index1];
            dropdownContent.classList.toggle('show');
        });
    });
});

iconCart.addEventListener('click', () => {
    let toggleShowCart = body.classList.toggle('showCart')
    if(toggleShowCart === true){
        sorter.style.visibility = "hidden"
        listProductHTML.style.marginBottom = "-70%";
    }else{
        listProductHTML.style.marginBottom = "-45%";
        sorter.style.visibility = "visible"
    };
});

closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
    listProductHTML.style.marginBottom = "-45%";
    sorter.style.visibility = "visible" 
})

document.addEventListener('DOMContentLoaded', function(){
    const images = document.querySelectorAll('img');
    images.forEach((img,index2) =>{
        if (index2 >= 8) {
            img.setAttribute('loading', 'lazy');
        }
    });
});

const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if (listProducts.length > 0) {
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="" loading="lazy">
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
    if (positionClick.classList.contains('addCart')) {
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id)
    }
}) 


let quantity = 0;
const addToCart = (product_id) => {
    let positionThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if (carts.length <= 0) {
        carts = [{ product_id: product_id, quantity: 1 }];
    } else if (positionThisProductInCart < 0) {
        carts.push({ product_id: product_id, quantity: 1 });
    } else {
        carts[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
}

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(carts));
}

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (carts.length > 0) {
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex(value => value.id == cart.product_id);
            let info = listProducts[positionProduct];

            if (!info) {
                console.error("Product info not found for ID:", cart.product_id);
                return;
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
    iconCartSpan.innerHTML = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    let product_id = positionClick.closest('.item').dataset.id;
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
}

const initApp = () => {
    fetch('Projektiteminfo.json').then(response => response.json()).then(data => {
        listProducts = data;
        if (localStorage.getItem('cart')) {
            carts = JSON.parse(localStorage.getItem('cart'))
            addDataToHTML();
        }
    })
}
initApp();