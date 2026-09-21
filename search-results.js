var currentCartCount = 0;

function getCartItems() {
    var savedItems = localStorage.getItem("kovaCartItems");

    if (!savedItems) {
        var legacyCount = localStorage.getItem("storedCartCount");

        if (legacyCount !== null) {
            var count = Number(legacyCount);
            if (Number.isFinite(count) && count > 0) {
                var migratedItems = [{
                    name: "Previous item",
                    quantity: count
                }];
                localStorage.setItem("kovaCartItems", JSON.stringify(migratedItems));
                localStorage.removeItem("storedCartCount");
                return migratedItems;
            }
        }

        return [];
    }

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
        return [];
    }
}

function updateCartBadge() {
    var items = getCartItems();
    var total = 0;

    for (var i = 0; i < items.length; i++) {
        total = total + (Number(items[i].quantity) > 0 ? Number(items[i].quantity) : 1);
    }

    currentCartCount = total;

    var cartBadgeElement = document.getElementById("cartCountBadge");
    if (cartBadgeElement) {
        cartBadgeElement.innerText = currentCartCount;
    }
}

function addItemToCart(productNameOrData) {
    var productData = productNameOrData;
    var productName = productNameOrData;

    if (productNameOrData && typeof productNameOrData === "object") {
        productData = productNameOrData;
        productName = productNameOrData.title || productNameOrData.name || "Product";
    }

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
}

document.addEventListener("DOMContentLoaded", function() {
    updateCartBadge();

    window.addEventListener("storage", function(event) {
        if (event.key === "kovaCartItems") {
            updateCartBadge();
        }
    });

    var searchInput = document.getElementById("storeSearchInput");
    var searchButton = document.getElementById("searchButton");
    var searchTitle = document.getElementById("searchTitle");
    var searchSubtitle = document.getElementById("searchSubtitle");
    var grid = document.getElementById("searchResultsGrid");

    function getQueryFromUrl() {
        var params = new URLSearchParams(window.location.search);
        return (params.get("q") || "").trim();
    }

    function getSearchTerm() {
        return (searchInput && searchInput.value || "").trim();
    }

    function showLoadingSkeleton() {
        if (!grid) return;
        grid.innerHTML = [
            '<div class="skeleton-grid" style="grid-column: 1 / -1; width: 100%;">',
            '<div class="skeleton-card shine-wave"><div class="skeleton-image shine-wave"></div><div class="skeleton-line long shine-wave"></div><div class="skeleton-line short shine-wave"></div><div class="skeleton-line price shine-wave"></div></div>',
            '<div class="skeleton-card shine-wave"><div class="skeleton-image shine-wave"></div><div class="skeleton-line long shine-wave"></div><div class="skeleton-line short shine-wave"></div><div class="skeleton-line price shine-wave"></div></div>',
            '<div class="skeleton-card shine-wave"><div class="skeleton-image shine-wave"></div><div class="skeleton-line long shine-wave"></div><div class="skeleton-line short shine-wave"></div><div class="skeleton-line price shine-wave"></div></div>',
            '<div class="skeleton-card shine-wave"><div class="skeleton-image shine-wave"></div><div class="skeleton-line long shine-wave"></div><div class="skeleton-line short shine-wave"></div><div class="skeleton-line price shine-wave"></div></div>',
            '</div>'
        ].join("");
        if (searchTitle) searchTitle.textContent = 'Results for "loading..."';
        if (searchSubtitle) searchSubtitle.textContent = 'Loading products...';
    }

    function renderApiCards(products) {
        if (!grid) return;
        grid.innerHTML = "";

        if (!products.length) {
            var noResultsTerm = getSearchTerm() || getQueryFromUrl() || "your search";
            var noResultsMarkup = [
                '<div class="no-results-state" style="grid-column: 1 / -1; min-height: 520px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 48px 20px;">',
                '<div style="width: 78px; height: 78px; border-radius: 18px; background: #f3f4f6; display: flex; align-items: center; justify-content: center; margin-bottom: 30px;">',
                '<svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Search icon" style="stroke: #111827; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round;">',
                '<circle cx="11" cy="11" r="6.5"></circle>',
                '<path d="M16 16L21 21"></path>',
                '</svg>',
                '</div>',
                '<h2 style="margin: 0; font-size: 2.2rem; line-height: 1.2; letter-spacing: -0.04em; font-weight: 800; color: #111827;">No products match "' + noResultsTerm + '"</h2>',
                '<p style="max-width: 500px; margin: 18px 0 0; font-size: 1.05rem; color: #667085; line-height: 1.6;">Check the spelling, use fewer words, or browse a category instead.</p>',
                '<div style="display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; justify-content: center;">',
                '<button type="button" class="clear-search-btn" style="padding: 14px 22px; border-radius: 12px; border: 1px solid #d1d5db; background: #111827; color: #fff; font-weight: 700; cursor: pointer;">Clear search</button>',
                '<button type="button" class="browse-all-btn" style="padding: 14px 22px; border-radius: 12px; border: 1px solid #d1d5db; background: #fff; color: #111827; font-weight: 700; cursor: pointer;">Browse all</button>',
                '</div>',
                '<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; margin-top: 28px; color: #667085; font-size: 0.96rem;">',
                '<span style="font-weight: 600; color: #475467;">Popular:</span>',
                '<span style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; border: 1px solid #e5e7eb; background: #fff; border-radius: 999px; color: #374151; font-size: 0.92rem;">phone</span>',
                '<span style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; border: 1px solid #e5e7eb; background: #fff; border-radius: 999px; color: #374151; font-size: 0.92rem;">laptop</span>',
                '<span style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; border: 1px solid #e5e7eb; background: #fff; border-radius: 999px; color: #374151; font-size: 0.92rem;">watch</span>',
                '<span style="display: inline-flex; align-items: center; justify-content: center; padding: 8px 14px; border: 1px solid #e5e7eb; background: #fff; border-radius: 999px; color: #374151; font-size: 0.92rem;">bag</span>',
                '</div>',
                '</div>'
            ].join("");

            grid.innerHTML = noResultsMarkup;

            var clearButton = grid.querySelector(".clear-search-btn");
            var browseButton = grid.querySelector(".browse-all-btn");

            if (clearButton && searchInput) {
                clearButton.addEventListener("click", function() {
                    searchInput.value = "";
                    updateResultsFromApi();
                });
            }

            if (browseButton) {
                browseButton.addEventListener("click", function() {
                    window.location.href = "shop.html";
                });
            }

            return;
        }

        console.log("Showing search results from the API");

        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            var card = document.createElement("div");
            card.className = "product-card";
            card.setAttribute("data-product-key", product.id || product.title);

            card.innerHTML = [
                '<div class="card-image-box bg-pink-box">',
                '<button class="wishlist-btn">♡</button>',
                '<img src="' + (product.image || './Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg') + '" alt="' + product.title + '">',
                '</div>',
                '<div class="card-info">',
                '<span class="prod-cat">' + String(product.category || "GENERAL").toUpperCase() + '</span>',
                '<h4><a href="product-details.html?item=' + encodeURIComponent(product.id || product.title) + '" style="text-decoration: none; color: inherit;">' + product.title + '</a></h4>',
                '<p class="stars-row">★★★★★ <span class="num-rating">' + product.rating + '</span></p>',
                '<div class="price-and-action">',
                '<div class="price-stack">',
                '<span class="card-price">' + window.KovaAPI.formatPrice(product.price) + '</span>',
                '</div>',
                '<button class="add-cart-circle" onclick="addItemToCart(\'' + product.title.replace("'", "\\'") + '\')">+</button>',
                '</div>',
                '<span class="stock-status ' + (product.stock > 0 ? 'in-stock' : 'out-of-stock') + '">• ' + (product.stock > 0 ? 'In stock' : 'Out of stock') + '</span>',
                '</div>'
            ].join("");

            grid.appendChild(card);
        }

        var wishlistButtons = document.querySelectorAll(".wishlist-btn");
        for (var j = 0; j < wishlistButtons.length; j++) {
            wishlistButtons[j].addEventListener("click", function(event) {
                event.stopPropagation();
                var card = this.closest(".product-card");
                var key = card ? card.getAttribute("data-product-key") : "";
                toggleWishlistItem(key, key);
                syncWishlistButtons();
            });
        }
    }

    function updateResultsFromApi() {
        var term = getSearchTerm();
        if (!term) {
            term = getQueryFromUrl();
        }

        if (searchInput && term) {
            searchInput.value = term;
        }

        if (!window.KovaAPI) {
            return;
        }

        showLoadingSkeleton();

        if (!term) {
            searchTitle.textContent = "Results for \"all products\"";
            searchSubtitle.textContent = "Showing all products.";
            window.KovaAPI.fetchProducts(12, 0).then(function(products) {
                renderApiCards(products);
            }).catch(function() {
                grid.innerHTML = '<div class="empty-cart-box" style="grid-column: 1 / -1;"><h3>Unable to load products right now.</h3><p>Please try again later.</p></div>';
            });
            return;
        }

        searchTitle.textContent = "Results for \"" + term + "\"";
        window.KovaAPI.searchProducts(term).then(function(products) {
            renderApiCards(products);
            searchSubtitle.textContent = products.length + " product" + (products.length === 1 ? "" : "s") + " matched.";
        }).catch(function() {
            searchSubtitle.textContent = "Unable to load matching products.";
            grid.innerHTML = '<div class="empty-cart-box" style="grid-column: 1 / -1;"><h3>Unable to load matching products.</h3><p>Please try again later.</p></div>';
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", function() {
            var query = getSearchTerm();
            if (!query) return;
            window.location.href = "search-results.html?q=" + encodeURIComponent(query);
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                var query = getSearchTerm();
                if (!query) return;
                window.location.href = "search-results.html?q=" + encodeURIComponent(query);
            }
        });
    }

    updateResultsFromApi();
});
