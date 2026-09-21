// ================================
// KOVA CART SYSTEM
// ================================

const cartItems = document.querySelector("#cartItems");


if (cartItems) {

    let undoCart = null;
    let undoTimer = null;


    // ================================
    // FORMAT PRICE
    // ================================

    function formatPrice(value) {

        return `$${Number(value || 0).toFixed(2)}`;

    }


    // ================================
    // ESCAPE TEXT
    // ================================

    function escapeHTML(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ================================
    // GET CART
    // ================================

    function getCart() {

        return JSON.parse(
            localStorage.getItem("kovaCart")
        ) || [];

    }


    // ================================
    // SAVE CART
    // ================================

    function saveCart(cart) {

        localStorage.setItem(
            "kovaCart",
            JSON.stringify(cart)
        );

    }


    // ================================
    // GROUP CART PRODUCTS
    // ================================

    function groupCart(cart) {

        const grouped = {};

        cart.forEach(function(product) {

            const id = String(product.id);

            if (grouped[id]) {

                grouped[id].quantity++;

            } else {

                grouped[id] = {
                    id: product.id,
                    title: product.title,
                    price: Number(product.price) || 0,
                    thumbnail: product.thumbnail,
                    quantity: 1,

                    category: "",
                    stock: 999,
                    minimumOrderQuantity: 1,
                    discountPercentage: 0
                };

            }

        });

        return Object.values(grouped);

    }


    // ================================
    // GET PRODUCT INFORMATION
    // ================================

    async function getProductInformation(product) {

        try {

            const response = await fetch(
                `https://dummyjson.com/products/${product.id}`
            );

            if (!response.ok) {
                return product;
            }

            const data = await response.json();

            return {
                ...product,

                category: data.category || "",
                stock: Number(data.stock) || 999,
                minimumOrderQuantity:
                    Number(data.minimumOrderQuantity) || 1,
                discountPercentage:
                    Number(data.discountPercentage) || 0,

                // Keep the cart's saved values first
                title: product.title || data.title,
                price:
                    Number(product.price) ||
                    Number(data.price) ||
                    0,

                thumbnail:
                    product.thumbnail ||
                    data.thumbnail
            };

        } catch (error) {

            console.log(
                "Could not load product information:",
                error
            );

            return product;

        }

    }


    // ================================
    // STOCK STATUS
    // ================================

    function getStockHTML(stock) {

        stock = Number(stock);

        if (stock <= 0) {

            return `
                <p class="kova-stock kova-stock-out">
                    Out of stock
                </p>
            `;

        }

        if (stock <= 10) {

            return `
                <p class="kova-stock kova-stock-low">
                    Only ${stock} left
                </p>
            `;

        }

        return `
            <p class="kova-stock kova-stock-in">
                In stock
            </p>
        `;

    }


    // ================================
    // DISCOUNT HTML
    // ================================

    function getDiscountHTML(product) {

        const discount =
            Number(product.discountPercentage) || 0;

        if (discount < 5) {

            return "";

        }

        const oldPrice =
            product.price / (1 - discount / 100);

        return `
            <span class="kova-discount-tag">
                ${discount.toFixed(0)}% OFF
            </span>

            <span class="kova-price-old">
                ${formatPrice(oldPrice)}
            </span>
        `;

    }


    // ================================
    // DISPLAY CART
    // ================================

    async function displayCart() {

        const rawCart = getCart();

        cartItems.innerHTML = `
            <div class="kova-cart-loading">
                Loading your cart...
            </div>
        `;


        // ================================
        // EMPTY CART
        // ================================

        if (rawCart.length === 0) {

            showEmptyCart();

            return;

        }


        // ================================
        // GROUP PRODUCTS
        // ================================

        let products = groupCart(rawCart);


        // ================================
        // GET EXTRA PRODUCT INFORMATION
        // ================================

        products = await Promise.all(

            products.map(function(product) {

                return getProductInformation(product);

            })

        );


        // ================================
        // CHECK CART DIDN'T CHANGE
        // ================================

        const currentCart =
            getCart();

        if (currentCart.length === 0) {

            showEmptyCart();

            return;

        }


        // ================================
        // TOTALS
        // ================================

        let subtotal = 0;

        let discountTotal = 0;

        let totalQuantity = 0;


        products.forEach(function(product) {

            const quantity =
                Number(product.quantity) || 1;

            const price =
                Number(product.price) || 0;

            const discount =
                Number(product.discountPercentage) || 0;

            const productSubtotal =
                price * quantity;

            subtotal += productSubtotal;

            totalQuantity += quantity;


            if (discount > 0) {

                const discountedPrice =
                    price * (1 - discount / 100);

                const discountAmount =
                    (price - discountedPrice) * quantity;

                discountTotal += discountAmount;

            }

        });


        const finalTotal =
            subtotal - discountTotal;


        // ================================
        // UPDATE HEADER COUNT
        // ================================

        const cartCount =
            document.querySelector("#cartCount");

        if (cartCount) {

            cartCount.textContent =
                `${products.length} product${products.length !== 1 ? "s" : ""} · ${totalQuantity} item${totalQuantity !== 1 ? "s" : ""}`;

        }


        // ================================
        // UPDATE SUMMARY
        // ================================

        const cartSubtotal =
            document.querySelector("#cartSubtotal");

        const cartDiscount =
            document.querySelector("#cartDiscount");

        const finalTotalElement =
            document.querySelector("#finalTotal");


        if (cartSubtotal) {

            cartSubtotal.textContent =
                formatPrice(subtotal);

        }


        if (cartDiscount) {

            cartDiscount.textContent =
                `−${formatPrice(discountTotal)}`;

        }


        if (finalTotalElement) {

            finalTotalElement.textContent =
                formatPrice(finalTotal);

        }


        // ================================
        // DISPLAY PRODUCTS
        // ================================

        cartItems.innerHTML = "";


        products.forEach(function(product) {

            const price =
                Number(product.price) || 0;

            const quantity =
                Number(product.quantity) || 1;

            const discount =
                Number(product.discountPercentage) || 0;


            let discountedPrice = price;

            if (discount > 0) {

                discountedPrice =
                    price * (1 - discount / 100);

            }


            const lineTotal =
                discountedPrice * quantity;


            const item =
                document.createElement("article");


            item.className =
                "kova-cart-item";


            item.innerHTML = `

                <!-- PRODUCT IMAGE -->

                <div class="kova-cart-thumbnail">

                    <img
                        src="${escapeHTML(product.thumbnail)}"
                        alt="${escapeHTML(product.title)}"
                    >

                </div>


                <!-- PRODUCT INFORMATION -->

                <div class="kova-cart-info">

                    <p class="kova-cart-category">

                        ${escapeHTML(
                            product.category || "Product"
                        )}

                    </p>


                    <h3 class="kova-cart-title">

                        ${escapeHTML(product.title)}

                    </h3>


                    <div class="kova-cart-price">

                        <span class="kova-price-current">

                            ${formatPrice(discountedPrice)}

                        </span>

                        ${getDiscountHTML(product)}

                    </div>


                    ${getStockHTML(product.stock)}

                </div>


                <!-- QUANTITY -->

                <div class="kova-quantity-stepper">

                    <button
                        type="button"
                        onclick="changeQuantity(${product.id}, -1)"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <span class="kova-quantity-value">

                        ${quantity}

                    </span>


                    <button
                        type="button"
                        onclick="changeQuantity(${product.id}, 1)"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>

                </div>


                <!-- LINE TOTAL -->

                <div class="kova-line-total">

                    ${formatPrice(lineTotal)}

                </div>


                <!-- REMOVE -->

                <button
                    type="button"
                    class="kova-remove-button"
                    onclick="removeProduct(${product.id})"
                    aria-label="Remove ${escapeHTML(product.title)}"
                    title="Remove"
                >
                    🗑
                </button>

            `;


            cartItems.appendChild(item);

        });


        // ================================
        // SHOW CART ACTIONS
        // ================================

        const cartActions =
            document.querySelector("#cartActions");

        if (cartActions) {

            cartActions.style.display = "flex";

        }

    }


    // ================================
    // EMPTY CART
    // ================================

    function showEmptyCart() {

        cartItems.innerHTML = `

            <div class="kova-empty-cart">

                <div class="kova-empty-icon">
                    🛒
                </div>


                <h2>
                    Your cart is empty
                </h2>


                <p>
                    Nothing here yet. Browse products across KOVA
                    and add something you like.
                </p>


                <div class="kova-empty-actions">

                    <a
                        href="products.html"
                        class="kova-button kova-button-secondary"
                    >
                        Browse products
                    </a>


                    <a
                        href="products.html?filter=deals"
                        class="kova-button kova-checkout-button"
                    >
                        View deals
                    </a>

                </div>

            </div>

        `;


        // Reset summary

        const cartCount =
            document.querySelector("#cartCount");

        const cartSubtotal =
            document.querySelector("#cartSubtotal");

        const cartDiscount =
            document.querySelector("#cartDiscount");

        const finalTotal =
            document.querySelector("#finalTotal");


        if (cartCount) {

            cartCount.textContent =
                "0 products · 0 items";

        }


        if (cartSubtotal) {

            cartSubtotal.textContent =
                "$0.00";

        }


        if (cartDiscount) {

            cartDiscount.textContent =
                "−$0.00";

        }


        if (finalTotal) {

            finalTotal.textContent =
                "$0.00";

        }


        const cartActions =
            document.querySelector("#cartActions");

        if (cartActions) {

            cartActions.style.display = "none";

        }

    }


    // ================================
    // CHANGE QUANTITY
    // ================================

    window.changeQuantity =
        async function(productId, change) {

        let cart = getCart();


        // ================================
        // ADD ONE
        // ================================

        if (change === 1) {

            const product =
                cart.find(function(item) {

                    return String(item.id) ===
                        String(productId);

                });


            if (product) {

                cart.push({

                    id: product.id,

                    title: product.title,

                    price: product.price,

                    thumbnail: product.thumbnail

                });

            }

        }


        // ================================
        // REMOVE ONE
        // ================================

        if (change === -1) {

            const index =
                cart.findIndex(function(item) {

                    return String(item.id) ===
                        String(productId);

                });


            if (index !== -1) {

                cart.splice(index, 1);

            }

        }


        saveCart(cart);

        await displayCart();

    };


    // ================================
    // REMOVE ENTIRE PRODUCT
    // ================================

    window.removeProduct =
        function(productId) {

        const cart = getCart();


        const removedItems =
            cart.filter(function(product) {

                return String(product.id) ===
                    String(productId);

            });


        if (removedItems.length === 0) {

            return;

        }


        // Save for undo

        undoCart = removedItems;


        // Remove product

        const newCart =
            cart.filter(function(product) {

                return String(product.id) !==
                    String(productId);

            });


        saveCart(newCart);


        displayCart();


        showUndoToast(
            removedItems[0].title,
            removedItems
        );

    };


    // ================================
    // CLEAR CART
    // ================================

    function clearCart() {

        const cart = getCart();


        if (cart.length === 0) {

            return;

        }


        undoCart = cart;


        saveCart([]);


        displayCart();


        showUndoToast(
            "All products",
            cart
        );

    }


    // ================================
    // UNDO TOAST
    // ================================

    function showUndoToast(
        productName,
        items
    ) {

        const oldToast =
            document.querySelector(
                ".kova-undo-toast"
            );


        if (oldToast) {

            oldToast.remove();

        }


        const toast =
            document.createElement("div");


        toast.className =
            "kova-undo-toast";


        toast.innerHTML = `

            <span>
                ${escapeHTML(productName)} removed
            </span>

            <button
                type="button"
                id="undoCartButton"
            >
                Undo
            </button>

        `;


        document.body.appendChild(toast);


        const undoButton =
            document.querySelector(
                "#undoCartButton"
            );


        if (undoButton) {

            undoButton.addEventListener(
                "click",
                function() {

                    undoRemove(items);

                }
            );

        }


        clearTimeout(undoTimer);


        undoTimer =
            setTimeout(function() {

                toast.remove();

                undoCart = null;

            }, 5000);

    }


    // ================================
    // UNDO REMOVE
    // ================================

    async function undoRemove(items) {

        if (!items || items.length === 0) {

            return;

        }


        let cart = getCart();


        cart =
            cart.concat(items);


        saveCart(cart);


        undoCart = null;


        clearTimeout(undoTimer);


        const toast =
            document.querySelector(
                ".kova-undo-toast"
            );


        if (toast) {

            toast.remove();

        }


        await displayCart();

    }


    // ================================
    // CLEAR BUTTONS
    // ================================

    const clearCartTop =
        document.querySelector("#clearCartTop");


    if (clearCartTop) {

        clearCartTop.addEventListener(
            "click",
            clearCart
        );

    }


    const clearCartBottom =
        document.querySelector("#clearCartBottom");


    if (clearCartBottom) {

        clearCartBottom.addEventListener(
            "click",
            clearCart
        );

    }


    // ================================
    // CHECKOUT BUTTON
    // ================================

    const checkoutButton =
        document.querySelector("#checkoutButton");


    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function() {

                const cart = getCart();


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


    // ================================
    // START CART
    // ================================

    displayCart();

}
