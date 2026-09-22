/* =========================================
   KOVA CART
   Connects to the existing Product Details
   Add-to-Cart system.

   Storage key:
   kovaCartItems
========================================= */


/* =========================================
   GET CART
========================================= */

function getCart() {

    const savedItems = localStorage.getItem("kovaCartItems");

    if (savedItems) {

        try {

            const items = JSON.parse(savedItems);

            if (Array.isArray(items)) {

                const cart = [];

                items.forEach(function(item) {

                    const quantity =
                        Number(item.quantity) > 0
                            ? Number(item.quantity)
                            : 1;

                    for (let i = 0; i < quantity; i++) {

                        cart.push({

                            id: item.id,

                            title:
                                item.title ||
                                item.name ||
                                "Product",

                            price:
                                Number(item.price) || 0,

                            thumbnail:
                                item.thumbnail ||
                                item.image ||
                                "",

                            category:
                                item.category ||
                                "General"

                        });

                    }

                });

                return cart;
            }

        } catch (error) {

            console.log("Could not read cart:", error);

        }

    }

    return [];
}


/* =========================================
   SAVE CART
========================================= */

function saveCart(cart) {

    const grouped = {};

    cart.forEach(function(product) {

        const key =
            product.id !== null &&
            product.id !== undefined
                ? String(product.id)
                : String(product.title);


        if (!grouped[key]) {

            grouped[key] = {

                id: product.id ?? null,

                name:
                    product.title ||
                    product.name ||
                    "Product",

                title:
                    product.title ||
                    product.name ||
                    "Product",

                image:
                    product.thumbnail ||
                    product.image ||
                    null,

                price:
                    Number(product.price) || 0,

                category:
                    product.category ||
                    "General",

                quantity: 1

            };

        } else {

            grouped[key].quantity++;

        }

    });


    localStorage.setItem(
        "kovaCartItems",
        JSON.stringify(Object.values(grouped))
    );

}


/* =========================================
   GROUP CART
========================================= */

function groupCart(cart) {

    const grouped = {};

    cart.forEach(function(product) {

        const key =
            product.id !== null &&
            product.id !== undefined
                ? String(product.id)
                : String(product.title);


        if (!grouped[key]) {

            grouped[key] = {

                id: product.id,

                title:
                    product.title ||
                    product.name ||
                    "Product",

                price:
                    Number(product.price) || 0,

                thumbnail:
                    product.thumbnail ||
                    product.image ||
                    "",

                category:
                    product.category ||
                    "General",

                quantity: 0

            };

        }

        grouped[key].quantity++;

    });

    return Object.values(grouped);
}


/* =========================================
   GET PRODUCT INFORMATION
========================================= */

async function getProductInformation(product) {

    if (
        product.id === null ||
        product.id === undefined ||
        product.id === ""
    ) {

        return product;

    }


    try {

        const response = await fetch(
            "https://dummyjson.com/products/" + product.id
        );

        if (!response.ok) {

            return product;

        }

        const data = await response.json();


        return {

            ...product,

            title:
                data.title ||
                product.title,

            price:
                Number(data.price) ||
                Number(product.price) ||
                0,

            thumbnail:
                data.thumbnail ||
                product.thumbnail,

            category:
                data.category ||
                product.category ||
                "General",

            discountPercentage:
                Number(data.discountPercentage) || 0

        };

    } catch (error) {

        console.log(
            "Could not fetch product information:",
            error
        );

        return product;

    }

}


/* =========================================
   DISPLAY CART
========================================= */

async function displayCart() {

    const cartContainer =
        document.getElementById("cartItems");

    const cartCount =
        document.getElementById("cartCount");

    const subtotalElement =
        document.getElementById("cartSubtotal");

    const discountElement =
        document.getElementById("cartDiscount");

    const totalElement =
        document.getElementById("finalTotal");


    const cart = getCart();

    const groupedCart = groupCart(cart);


    /* EMPTY CART */

    if (groupedCart.length === 0) {

        if (cartContainer) {

            cartContainer.innerHTML = `

                <div class="kova-empty-cart">

                    <h2>Your cart is empty</h2>

                    <p>
                        You haven't added anything to your cart yet.
                    </p>

                    <a
                        href="products.html"
                        class="kova-button kova-button-secondary"
                    >
                        Continue shopping
                    </a>

                </div>

            `;

        }


        if (cartCount) {

            cartCount.textContent =
                "0 products · 0 items";

        }


        if (subtotalElement) {

            subtotalElement.textContent =
                "$0.00";

        }


        if (discountElement) {

            discountElement.textContent =
                "−$0.00";

        }


        if (totalElement) {

            totalElement.textContent =
                "$0.00";

        }


        return;

    }


    /* GET DETAILS */

    const products = [];

    for (const product of groupedCart) {

        products.push(
            await getProductInformation(product)
        );

    }


    /* TOTALS */

    let subtotal = 0;

    let discount = 0;

    let totalItems = 0;


    products.forEach(function(product) {

        const quantity =
            Number(product.quantity) || 1;

        const price =
            Number(product.price) || 0;

        const discountPercentage =
            Number(product.discountPercentage) || 0;


        subtotal +=
            price * quantity;


        discount +=
            price *
            quantity *
            (discountPercentage / 100);


        totalItems += quantity;

    });


    const total =
        subtotal - discount;


    /* CART COUNT */

    if (cartCount) {

        cartCount.textContent =
            products.length +
            " products · " +
            totalItems +
            " items";

    }


    /* SUMMARY */

    if (subtotalElement) {

        subtotalElement.textContent =
            "$" + subtotal.toFixed(2);

    }


    if (discountElement) {

        discountElement.textContent =
            "−$" + discount.toFixed(2);

    }


    if (totalElement) {

        totalElement.textContent =
            "$" + total.toFixed(2);

    }


    /* RENDER */

    if (!cartContainer) {

        return;

    }


    cartContainer.innerHTML = "";


    products.forEach(function(product) {

        const item =
            document.createElement("div");


        item.className =
            "kova-cart-item";


        item.innerHTML = `

            <img
                class="kova-cart-item-image"
                src="${product.thumbnail || ""}"
                alt="${product.title}"
            >

            <div class="kova-cart-item-info">

                <div class="kova-cart-item-category">
                    ${product.category || "General"}
                </div>

                <h3 class="kova-cart-item-title">
                    ${product.title}
                </h3>

                <div class="kova-cart-item-price">
                    $${Number(product.price).toFixed(2)}
                </div>

                <div class="kova-cart-item-controls">

                    <div class="kova-quantity-control">

                        <button
                            type="button"
                            onclick="changeQuantity(${JSON.stringify(product.id)}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${product.quantity}
                        </span>

                        <button
                            type="button"
                            onclick="changeQuantity(${JSON.stringify(product.id)}, 1)"
                        >
                            +
                        </button>

                    </div>

                    <button
                        type="button"
                        class="kova-remove-button"
                        onclick="removeProduct(${JSON.stringify(product.id)})"
                    >
                        Remove
                    </button>

                </div>

            </div>

        `;


        cartContainer.appendChild(item);

    });

}


/* =========================================
   CHANGE QUANTITY
========================================= */

window.changeQuantity = function(productId, amount) {

    const cart = getCart();


    const index =
        cart.findIndex(function(product) {

            return String(product.id) ===
                String(productId);

        });


    if (index === -1) {

        return;

    }


    if (amount > 0) {

        cart.push({
            ...cart[index]
        });

    } else {

        cart.splice(index, 1);

    }


    saveCart(cart);

    displayCart();

};


/* =========================================
   REMOVE PRODUCT
========================================= */

window.removeProduct = function(productId) {

    const cart = getCart();


    const updatedCart =
        cart.filter(function(product) {

            return String(product.id) !==
                String(productId);

        });


    saveCart(updatedCart);

    displayCart();

};


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    localStorage.removeItem(
        "kovaCartItems"
    );

    displayCart();

}


/* =========================================
   CLEAR BUTTONS
========================================= */

const clearTop =
    document.getElementById("clearCartTop");

const clearBottom =
    document.getElementById("clearCartBottom");


if (clearTop) {

    clearTop.addEventListener(
        "click",
        clearCart
    );

}


if (clearBottom) {

    clearBottom.addEventListener(
        "click",
        clearCart
    );

}


/* =========================================
   CHECKOUT
========================================= */

const checkoutButton =
    document.getElementById("checkoutButton");


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        function() {

            const cart =
                getCart();


            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;

            }


            window.location.href =
                "checkout.html";

        }
    );

}


/* =========================================
   UPDATE CART
   If another page changes localStorage
========================================= */

window.addEventListener(
    "storage",
    function(event) {

        if (
            event.key === "kovaCartItems"
        ) {

            displayCart();

        }

    }
);


/* =========================================
   START
========================================= */

displayCart();