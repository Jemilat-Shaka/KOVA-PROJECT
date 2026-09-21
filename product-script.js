var currentProduct = null;
var selectedQty = 1;

function updateProductQuantityDisplay() {
    var qtyDisplay = document.getElementById("productQtyDisplay");
    if (qtyDisplay) qtyDisplay.textContent = String(selectedQty);

    var addButton = document.querySelector(".btn-add-to-cart-large");
    if (addButton && currentProduct && currentProduct.price) {
        addButton.textContent = "Add to cart — " + formatPrice(currentProduct.price * selectedQty);
    }
}

function setProductText(id, value) {
    var element = document.getElementById(id);
    if (element) element.textContent = value || "";
}

function renderReviews(product) {
    var reviewList = document.getElementById("prodDetailsReviewList");
    if (!reviewList) return;

    reviewList.innerHTML = "";
    var reviews = Array.isArray(product.reviewsList) ? product.reviewsList : [];
    for (var i = 0; i < reviews.length; i++) {
        var review = reviews[i] || {};
        var article = document.createElement("article");
        var authorRow = document.createElement("div");
        var avatar = document.createElement("img");
        var reviewer = document.createElement("strong");
        var stars = document.createElement("span");
        var comment = document.createElement("p");
        authorRow.className = "review-author-row";
        avatar.className = "review-avatar";
        avatar.src = "./Kova-UI-Kit/02-assets/avatars/rev-" + ((i % 3) + 1) + ".jpg";
        avatar.alt = "";
        avatar.setAttribute("aria-hidden", "true");
        reviewer.textContent = review.reviewerName || "Verified buyer";
        stars.textContent = "★★★★★";
        comment.textContent = review.comment || "No comment provided.";
        authorRow.appendChild(avatar);
        authorRow.appendChild(reviewer);
        authorRow.appendChild(stars);
        article.appendChild(authorRow);
        article.appendChild(comment);
        reviewList.appendChild(article);
    }
}

function getCartItems() {
    var savedItems = localStorage.getItem("kovaCartItems");
    if (!savedItems) return [];

    try {
        var parsedItems = JSON.parse(savedItems);
        if (!Array.isArray(parsedItems)) return [];

        var items = [];
        for (var i = 0; i < parsedItems.length; i++) {
            var item = parsedItems[i];
            if (!item || typeof item !== "object") {
                items.push({ name: "Unknown item", quantity: 1 });
            } else {
                items.push({
                    id: item.id || item.productId || null,
                    name: item.name || item.title || "Unknown item",
                    title: item.title || item.name || "Unknown item",
                    image: item.image || item.thumbnail || null,
                    price: item.price || 0,
                    category: item.category || "General",
                    quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1
                });
            }
        }

        return items;
    } catch (error) {
        console.log("Cart data could not be read");
        return [];
    }
}

function updateCartBadge() {
    var items = getCartItems();
    var total = 0;

    for (var i = 0; i < items.length; i++) {
        total = total + (Number(items[i].quantity) > 0 ? Number(items[i].quantity) : 1);
    }

    var cartBadge = document.getElementById("cartCountBadge");
    if (cartBadge) {
        cartBadge.textContent = total;
    }
}

function resolveCartProductData(productNameOrData, callback) {
    if (productNameOrData && typeof productNameOrData === "object") {
        callback(productNameOrData);
        return;
    }

    var productName = String(productNameOrData || "").trim();
    if (!productName) {
        callback({ title: "Product", name: "Product", image: null, price: 0, category: "General" });
        return;
    }

    if (window.KovaAPI && typeof window.KovaAPI.searchProducts === "function") {
        window.KovaAPI.searchProducts(productName).then(function(results) {
            var match = null;
            for (var i = 0; i < results.length; i++) {
                if ((results[i].title || "").toLowerCase() === productName.toLowerCase()) {
                    match = results[i];
                    break;
                }
            }

            if (!match && results.length) {
                match = results[0];
            }

            if (match) {
                callback(match);
                return;
            }

            callback({ title: productName, name: productName, image: null, price: 0, category: "General" });
        }).catch(function() {
            callback({ title: productName, name: productName, image: null, price: 0, category: "General" });
        });
        return;
    }

    callback({ title: productName, name: productName, image: null, price: 0, category: "General" });
}

function addItemToCart(productNameOrData) {
    resolveCartProductData(productNameOrData, function(productData) {
        var productName = productData.title || productData.name || "Product";
        var items = getCartItems();
        var existingItem = null;

        for (var i = 0; i < items.length; i++) {
            var savedName = items[i].name || items[i].title || "";
            if (savedName === productName || items[i].id === (productData && productData.id)) {
                existingItem = items[i];
                break;
            }
        }

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity || 1) + 1;
            if (productData && productData.image) existingItem.image = productData.image;
            if (productData && productData.price) existingItem.price = productData.price;
            if (productData && productData.category) existingItem.category = productData.category;
            if (productData && productData.id) existingItem.id = productData.id;
        } else {
            items.push({
                id: productData && productData.id ? productData.id : null,
                name: productName,
                title: productName,
                image: productData && productData.image ? productData.image : null,
                price: productData && productData.price ? productData.price : 0,
                category: productData && productData.category ? productData.category : "General",
                quantity: 1
            });
        }

        localStorage.setItem("kovaCartItems", JSON.stringify(items));
        updateCartBadge();
        alert(productName + " has been added to your cart successfully!");
    });
}

function increaseProductQty() {
    selectedQty += 1;
    updateProductQuantityDisplay();
}

function decreaseProductQty() {
    if (selectedQty > 1) {
        selectedQty -= 1;
        updateProductQuantityDisplay();
    }
}

function changeActiveView(element) {
    var allThumbs = document.querySelectorAll(".thumb-box");
    for (var i = 0; i < allThumbs.length; i++) {
        allThumbs[i].classList.remove("active");
    }

    if (element) {
        element.classList.add("active");
        var src = element.getAttribute("data-image") || element.querySelector("img").src;
        var mainImage = document.getElementById("mainProductView");
        if (mainImage && src) mainImage.src = src;
    }
}

function renderGallery(product) {
    var thumbnailList = document.getElementById("thumbnailList");
    if (!thumbnailList) return;

    thumbnailList.innerHTML = "";
    var images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];

    for (var i = 0; i < images.length; i++) {
        var thumb = document.createElement("div");
        thumb.className = "thumb-box" + (i === 0 ? " active" : "");
        thumb.setAttribute("data-image", images[i]);
        thumb.setAttribute("onclick", "changeActiveView(this)");

        var img = document.createElement("img");
        img.src = images[i];
        img.alt = product.title + " view " + (i + 1);
        img.className = "thumb-img";

        thumb.appendChild(img);
        thumbnailList.appendChild(thumb);
    }
}

function triggerLargeAddToCart() {
    if (!currentProduct) return;
    var title = currentProduct.title || "Product";
    var qtyToAdd = selectedQty;
    var items = getCartItems();
    var existingItem = null;

    for (var i = 0; i < items.length; i++) {
        if (items[i].name === title || items[i].id === (currentProduct && currentProduct.id)) {
            existingItem = items[i];
            break;
        }
    }

    if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity || 1) + qtyToAdd;
        if (currentProduct && currentProduct.image) existingItem.image = currentProduct.image;
        if (currentProduct && currentProduct.price) existingItem.price = currentProduct.price;
        if (currentProduct && currentProduct.category) existingItem.category = currentProduct.category;
        if (currentProduct && currentProduct.id) existingItem.id = currentProduct.id;
    } else {
        items.push({
            id: currentProduct && currentProduct.id ? currentProduct.id : null,
            name: title,
            title: title,
            image: currentProduct && currentProduct.image ? currentProduct.image : null,
            price: currentProduct && currentProduct.price ? currentProduct.price : 0,
            category: currentProduct && currentProduct.category ? currentProduct.category : "General",
            quantity: qtyToAdd
        });
    }

    localStorage.setItem("kovaCartItems", JSON.stringify(items));
    updateCartBadge();
    alert(title + " has been added to your cart.");
}

var productCatalog = {
    mascara: {
        title: "Essence Mascara Lash Princess",
        category: "Beauty",
        categoryKey: "beauty",
        price: 9.27,
        oldPrice: 9.99,
        rating: 4.94,
        reviews: 140,
        description: "The Essence Mascara Lash Princess defines and separates lashes while achieving a bold, dramatic volume look that lasts all day without flaking or smudging.",
        stock: 94,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg"
        ],
        background: "bg-pink-box"
    },
    rolex: {
        title: "Rolex Submariner Watch",
        category: "Mens-Watches",
        categoryKey: "mens-watches",
        price: 13885.19,
        oldPrice: 0,
        rating: 4.95,
        reviews: 32,
        description: "A premium timepiece with classic design, precise movement, and a polished finish built for everyday wear and lasting performance.",
        stock: 12,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-mens-watches.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-mens-watches.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-mens-watches.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-mens-watches.jpg"
        ],
        background: "bg-blue-box"
    },
    bed: {
        title: "Annibale Colombo Bed",
        category: "Furniture",
        categoryKey: "furniture",
        price: 1894.48,
        oldPrice: 0,
        rating: 4.77,
        reviews: 24,
        description: "A refined statement bed designed with premium craftsmanship, elegant proportions, and a contemporary silhouette for a restful bedroom.",
        stock: 7,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-furniture.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-furniture.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-furniture.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-furniture.jpg"
        ],
        background: "bg-gold-box"
    },
    helmet: {
        title: "Cricket Helmet",
        category: "Sports-Accessories",
        categoryKey: "sports-accessories",
        price: 39.83,
        oldPrice: 44.99,
        rating: 4.19,
        reviews: 18,
        description: "Protective, lightweight, and engineered for comfort during match play and practice with dependable safety features.",
        stock: 62,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-sports.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-sports.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-sports.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-sports.jpg"
        ],
        background: "bg-purple-box"
    },
    ckone: {
        title: "Calvin Klein CK One",
        category: "Fragrances",
        categoryKey: "fragrances",
        price: 49.85,
        oldPrice: 0,
        rating: 4.85,
        reviews: 41,
        description: "A fresh signature fragrance blending citrus, woody, and musky tones to deliver a clean, modern, and long-lasting scent.",
        stock: 18,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-perfume.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-perfume.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-perfume.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-perfume.jpg"
        ],
        background: "bg-purple-box"
    },
    macbook: {
        title: "Apple MacBook Pro 14 Inch Space Grey",
        category: "Laptops",
        categoryKey: "laptops",
        price: 1785.59,
        oldPrice: 1999.4,
        rating: 4.51,
        reviews: 63,
        description: "A compact professional laptop with an ultra-fast chip, bright display, and all-day productivity in a refined, portable design.",
        stock: 8,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-laptops.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-laptops.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-laptops.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-laptops.jpg"
        ],
        background: "bg-blue-box"
    },
    iphone: {
        title: "iPhone 6",
        category: "Smartphones",
        categoryKey: "smartphones",
        price: 283.1,
        oldPrice: 299.99,
        rating: 4.55,
        reviews: 29,
        description: "A compact and reliable smartphone with strong battery life, streamlined performance, and a familiar design.",
        stock: 0,
        stockStatus: "Out of Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg"
        ],
        background: "bg-pink-box"
    },
    airpods: {
        title: "Apple AirPods Max Silver",
        category: "Mobile-Accessories",
        categoryKey: "mobile-accessories",
        price: 536.79,
        oldPrice: 0,
        rating: 4.36,
        reviews: 36,
        description: "Immersive over-ear wireless sound with premium cushioning, active noise cancellation, and seamless Apple-device pairing.",
        stock: 14,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-smartphones.jpg"
        ],
        background: "bg-green-circle"
    },
    bag: {
        title: "Marc Jacobs Shoulder Bag",
        category: "Womens-Bags",
        categoryKey: "womens-bags",
        price: 166.43,
        oldPrice: 189.99,
        rating: 4.31,
        reviews: 21,
        description: "A chic shoulder bag featuring a structured silhouette, refined finish, and functional everyday storage.",
        stock: 26,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-womens-bags.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-womens-bags.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-womens-bags.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-womens-bags.jpg"
        ],
        background: "bg-pink-box"
    },
    charger: {
        title: "Charger SXT RWD",
        category: "Vehicle",
        categoryKey: "vehicle",
        price: 28581.29,
        oldPrice: 32999.99,
        rating: 4.16,
        reviews: 17,
        description: "A high-performance vehicle option designed for speed, comfort, and a bold modern presence on the road.",
        stock: 3,
        stockStatus: "In Stock",
        image: "./Kova-UI-Kit/02-assets/product-placeholders/ph-vehicle.jpg",
        images: [
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-vehicle.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-vehicle.jpg",
            "./Kova-UI-Kit/02-assets/product-placeholders/ph-vehicle.jpg"
        ],
        background: "bg-blue-box"
    }
};

function loadProductFromQuery() {
    var params = new URLSearchParams(window.location.search);
    var itemValue = params.get("item") || "mascara";
    var key = String(itemValue).toLowerCase();

    if (window.KovaAPI) {
        var productLookup = null;
        if (!isNaN(Number(itemValue))) {
            productLookup = window.KovaAPI.fetchProductById(itemValue);
        } else {
            productLookup = window.KovaAPI.searchProducts(itemValue).then(function(products) {
                var matchedProduct = null;
                for (var i = 0; i < products.length; i++) {
                    var product = products[i];
                    var titleMatch = String(product.title).toLowerCase().indexOf(key) !== -1;
                    var categoryMatch = String(product.categoryKey || "").toLowerCase().indexOf(key) !== -1;
                    var idMatch = String(product.id).toLowerCase() === key;

                    if (titleMatch || categoryMatch || idMatch) {
                        matchedProduct = product;
                        break;
                    }
                }

                if (matchedProduct) {
                    return matchedProduct;
                }

                if (products.length > 0) {
                    return products[0];
                }

                return null;
            });
        }

        productLookup.then(function(product) {
            if (product) {
                currentProduct = product;
                renderProduct(product);
                return;
            }
            fallbackLegacyProduct();
        }).catch(function() {
            fallbackLegacyProduct();
        });
        return;
    }

    fallbackLegacyProduct();
}

function fallbackLegacyProduct() {
    var params = new URLSearchParams(window.location.search);
    var key = (params.get("item") || "mascara").toLowerCase();
    var product = productCatalog[key] || productCatalog.mascara;
    currentProduct = product;
    renderProduct(product);
}

function formatPrice(amount) {
    if (!amount || amount === 0) return "";
    return "$" + Number(amount).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function renderProduct(product) {
    if (!product) return;

    selectedQty = 1;

    var stage = document.getElementById("stageColorBg");
    var mainImage = document.getElementById("mainProductView");
    var title = document.getElementById("prodDetailsTitle");
    var category = document.getElementById("prodDetailsCategory");
    var rating = document.getElementById("prodDetailsRating");
    var price = document.getElementById("prodDetailsPrice");
    var oldPrice = document.getElementById("prodDetailsOldPrice");
    var description = document.getElementById("prodDetailsDesc");
    var stock = document.getElementById("prodDetailsStock");
    var breadcrumbCategory = document.getElementById("breadCat");
    var breadcrumbTitle = document.getElementById("breadTitle");
    var discount = Number(product.discountPercentage || 0);
    var dimensions = product.dimensions || {};
    var dimensionText = dimensions.width ? dimensions.width + " × " + dimensions.height + " × " + dimensions.depth + " cm" : "";
    var reviews = Array.isArray(product.reviewsList) ? product.reviewsList.length : Number(product.reviews || 0);

    if (stage) stage.className = "main-image-stage " + (product.background || "bg-pink-box");
    if (mainImage) mainImage.src = product.image;
    renderGallery(product);
    if (title) title.textContent = product.title;
    if (category) category.textContent = product.category.toUpperCase() + (product.brand ? " · " + product.brand.toUpperCase() : "");
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.category;
    if (breadcrumbTitle) breadcrumbTitle.textContent = product.title;
    if (rating) rating.textContent = product.rating;
    if (price) price.textContent = formatPrice(product.price);
    if (oldPrice) oldPrice.textContent = product.oldPrice ? formatPrice(product.oldPrice) : "";
    if (description) description.textContent = product.description;
    if (stock) stock.textContent = "Availability: " + product.stockStatus + " (" + product.stock + " left)";
    setProductText("prodDetailsPromo", discount > 0 ? "-" + discount + "% TODAY" : "");
    setProductText("prodDetailsReviews", reviews + " reviews");
    setProductText("prodDetailsReviewSummary", reviews + " REVIEWS · AVG " + Number(product.rating || 0).toFixed(2));
    setProductText("prodDetailsSku", product.sku ? "SKU " + product.sku : "");
    setProductText("prodDetailsDiscount", discount > 0 ? "· SAVE " + discount + "%" : "");
    setProductText("prodDetailsShipping", product.shippingInformation);
    setProductText("prodDetailsWarranty", product.warrantyInformation);
    setProductText("prodDetailsReturns", product.returnPolicy);
    setProductText("prodDetailsBrand", product.brand);
    setProductText("prodDetailsWeight", product.weight ? product.weight + " g" : "");
    setProductText("prodDetailsDimensions", dimensionText);
    setProductText("prodDetailsBarcode", product.barcode);
    setProductText("prodDetailsTags", product.tags && product.tags.length ? product.tags.join(", ") : "");
    renderReviews(product);
    updateProductQuantityDisplay();

    if (product.stock === 0) {
        var addBtn = document.querySelector(".btn-add-to-cart-large");
        if (addBtn) {
            addBtn.disabled = true;
            addBtn.textContent = "Out of stock";
            addBtn.style.opacity = "0.7";
            addBtn.style.cursor = "not-allowed";
        }
    }

    renderRecommendedProducts();
}

function renderRecommendedProducts() {
    var cards = document.querySelectorAll(".suggested-card");
    if (!cards.length || !window.KovaAPI) return;

    window.KovaAPI.fetchProducts(18, 0).then(function(products) {
        var currentTitle = currentProduct && currentProduct.title ? currentProduct.title : "";
        var filteredProducts = [];
        var seenTitles = {};

        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if (!product || !product.title) continue;
            if (product.title === currentTitle) continue;
            if (seenTitles[product.title]) continue;
            seenTitles[product.title] = true;
            filteredProducts.push(product);
        }

        for (var j = 0; j < cards.length; j++) {
            var card = cards[j];
            var product = filteredProducts[j];
            if (!product) continue;

            card.style.cursor = "pointer";
            card.setAttribute("data-product-key", product.id || product.title);

            var img = card.querySelector("img");
            var titleNode = card.querySelector("h5");
            var priceNode = card.querySelector(".s-price");
            var imageBox = card.querySelector(".s-img-box");

            if (img) {
                img.src = product.image || product.thumbnail || "./Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg";
                img.alt = product.title;
            }
            if (titleNode) titleNode.textContent = product.title;
            if (priceNode) priceNode.textContent = window.KovaAPI.formatPrice(product.price);
            if (imageBox) {
                imageBox.className = "s-img-box " + (product.background || "bg-purple-box");
            }

            card.onclick = function() {
                var key = this.getAttribute("data-product-key");
                if (key) {
                    window.location.href = "product-details.html?item=" + encodeURIComponent(key);
                }
            };
        }
    }).catch(function() {});
}

document.addEventListener("DOMContentLoaded", function() {
    updateCartBadge();

    window.addEventListener("storage", function(event) {
        if (event.key === "kovaCartItems") {
            updateCartBadge();
        }
    });

    loadProductFromQuery();

    updateProductQuantityDisplay();
});
