window.KovaAPI = (function() {
    var API_BASE = "https://dummyjson.com";

    function fetchJson(url) {
        return fetch(url).then(function(response) {
            if (!response.ok) {
                throw new Error("API request failed");
            }
            return response.json();
        });
    }

    function formatPrice(value) {
        return "$" + Number(value || 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function buildProductFromApi(product) {
        if (!product) {
            return null;
        }

        var imageFallback = "./Kova-UI-Kit/02-assets/product-placeholders/ph-beauty.jpg";
        var productImages = [];

        if (Array.isArray(product.images)) {
            for (var i = 0; i < product.images.length; i++) {
                if (product.images[i]) {
                    productImages.push(product.images[i]);
                }
            }
        }

        var primaryImage = product.thumbnail || (productImages.length ? productImages[0] : imageFallback);
        var priceValue = Number(product.price || 0);
        var discountValue = Number(product.discountPercentage || 0);
        var oldPriceValue = Number(product.oldPrice || 0);
        var computedOldPrice = oldPriceValue > 0 ? oldPriceValue : (discountValue > 0 ? priceValue / (1 - discountValue / 100) : priceValue);

        return {
            id: product.id,
            title: product.title,
            category: (product.category || "General").replace(/-/g, " "),
            categoryKey: String(product.category || "general").toLowerCase(),
            price: priceValue,
            oldPrice: computedOldPrice,
            rating: Number(product.rating || 0),
            reviews: Number(product.reviews || 0),
            description: product.description || "A curated product from the Kova catalog.",
            stock: Number(product.stock || 0),
            stockStatus: Number(product.stock || 0) > 0 ? "In Stock" : "Out of Stock",
            discountPercentage: discountValue,
            brand: product.brand || "",
            sku: product.sku || "",
            weight: product.weight,
            dimensions: product.dimensions || null,
            barcode: product.meta && product.meta.barcode ? product.meta.barcode : "",
            tags: Array.isArray(product.tags) ? product.tags : [],
            warrantyInformation: product.warrantyInformation || "",
            shippingInformation: product.shippingInformation || "",
            returnPolicy: product.returnPolicy || "",
            reviewsList: Array.isArray(product.reviews) ? product.reviews : [],
            image: primaryImage || imageFallback,
            images: productImages.length ? productImages : [primaryImage || imageFallback],
            background: "bg-pink-box"
        };
    }

    return {
        fetchProducts: function(limit, skip) {
            var query = "?limit=" + (limit || 12) + "&skip=" + (skip || 0);
            var url = API_BASE + "/products" + query + "&select=id,title,price,thumbnail,images,rating,stock,discountPercentage,category,description,brand,sku,weight,dimensions,meta,tags,warrantyInformation,shippingInformation,returnPolicy,reviews";
            return fetchJson(url).then(function(data) {
                var results = [];
                if (Array.isArray(data.products)) {
                    for (var i = 0; i < data.products.length; i++) {
                        results.push(buildProductFromApi(data.products[i]));
                    }
                }
                return results;
            });
        },
        fetchProductsByCategory: function(category, limit) {
            var slug = (category || "all").toLowerCase();
            if (!slug || slug === "all") {
                return this.fetchProducts(limit || 12, 0);
            }

            var url = API_BASE + "/products/category/" + encodeURIComponent(slug) + "?limit=" + (limit || 12) + "&select=id,title,price,thumbnail,images,rating,stock,discountPercentage,category,description,brand,sku,weight,dimensions,meta,tags,warrantyInformation,shippingInformation,returnPolicy,reviews";
            return fetchJson(url).then(function(data) {
                var results = [];
                if (Array.isArray(data.products)) {
                    for (var i = 0; i < data.products.length; i++) {
                        results.push(buildProductFromApi(data.products[i]));
                    }
                }
                return results;
            });
        },
        fetchProductById: function(id) {
            return fetchJson(API_BASE + "/products/" + id).then(function(data) {
                return buildProductFromApi(data);
            });
        },
        searchProducts: function(query) {
            var url = API_BASE + "/products/search?q=" + encodeURIComponent(query || "") + "&limit=12&select=id,title,price,thumbnail,images,rating,stock,discountPercentage,category,description,brand,sku,weight,dimensions,meta,tags,warrantyInformation,shippingInformation,returnPolicy,reviews";
            return fetchJson(url).then(function(data) {
                var results = [];
                if (Array.isArray(data.products)) {
                    for (var i = 0; i < data.products.length; i++) {
                        results.push(buildProductFromApi(data.products[i]));
                    }
                }
                return results;
            });
        },
        formatPrice: formatPrice
    };
})();
