// ==========================================
// KOVA HOME PAGE JAVASCRIPT
// ==========================================

// ==========================================
// 1. SHOP AND CATEGORIES NAVIGATION
// ==========================================

const navLinks = document.querySelectorAll(".a a");

navLinks.forEach(function (link) {
  const text = link.textContent.trim().toLowerCase();

  if (text === "shop" || text === "categories") {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      window.location.href = "beauty.html";
    });
  }
});

// ==========================================
// 2. BROWSE ALL PRODUCTS BUTTON
// ==========================================

const browseButton = document.querySelector(".main-button1");

if (browseButton) {
  browseButton.addEventListener("click", function () {
    window.location.href = "beauty.html";
  });
}

// ==========================================
// 3. TODAY'S DEALS BUTTON
// ==========================================

const dealsButton = document.querySelector(".main-button2");

if (dealsButton) {
  dealsButton.addEventListener("click", function () {
    const saleSection = [...document.querySelectorAll("h2")].find(
      function (heading) {
        return heading.textContent.trim().toLowerCase() === "on sale";
      },
    );

    if (saleSection) {
      saleSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

// ==========================================
// 4. SEARCH BAR
// ==========================================

const searchInput = document.querySelector('input[type="search"]');

if (searchInput) {
  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase().trim();

    const productCards = document.querySelectorAll(".top-r-div > div");

    productCards.forEach(function (card) {
      const productText = card.textContent.toLowerCase();

      if (productText.includes(searchValue)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
}

// ==========================================
// 5. WISHLIST / HEART BUTTON
// ==========================================

const wishlistButtons = document.querySelectorAll(".wishlist");

let wishlist = JSON.parse(localStorage.getItem("kovaWishlist")) || [];

wishlistButtons.forEach(function (button) {
  const card = button.closest(".top-r-div > div");

  const productName = card?.querySelector(".top-h3")?.textContent.trim();

  // Show products that were already saved
  if (productName && wishlist.includes(productName)) {
    button.textContent = "♥";
  }

  button.addEventListener("click", function (event) {
    event.stopPropagation();

    if (!productName) {
      return;
    }

    // Remove from wishlist
    if (wishlist.includes(productName)) {
      wishlist = wishlist.filter(function (item) {
        return item !== productName;
      });

      button.textContent = "♡";
    }

    // Add to wishlist
    else {
      wishlist.push(productName);

      button.textContent = "♥";
    }

    localStorage.setItem("kovaWishlist", JSON.stringify(wishlist));
  });
});

// ==========================================
// 6. CATEGORY BUTTONS
// ==========================================

const categoryButtons = document.querySelectorAll(".buttons");

categoryButtons.forEach(function (button) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const category = button.textContent.trim().toLowerCase();

    // Beauty has its own page
    if (category === "beauty") {
      window.location.href = "beauty.html";

      return;
    }

    // +10 more doesn't represent one category
    if (category === "+10 more") {
      alert("More categories will be available soon.");

      return;
    }

    // For the categories whose products are
    // already displayed on the Home page,
    // scroll to the product section.

    const productsSection = document.querySelector(".top-main");

    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// ==========================================
// 7. SEE ALL / VIEW ALL
// ==========================================

const allLinks = document.querySelectorAll(".cat-a");

allLinks.forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    window.location.href = "beauty.html";
  });
});

// ==========================================
// 8. CART ICON
// ==========================================

const cartImages = document.querySelectorAll(".user-cart img");

const cartIcon = cartImages[cartImages.length - 1];

if (cartIcon) {
  cartIcon.style.cursor = "pointer";

  cartIcon.addEventListener("click", function () {
    window.location.href = "checkout.html";
  });
}

// ==========================================
// 9. USER / ACCOUNT ICON
// ==========================================

const userIcon = document.querySelector(".user-cart img");

if (userIcon) {
  userIcon.style.cursor = "pointer";

  userIcon.addEventListener("click", function () {
    alert("Sign in functionality will be added here.");
  });
}

// ==========================================
// 10. PRODUCT CARD CLICK
// ==========================================

const productCards = document.querySelectorAll(".top-r-div > div");

productCards.forEach(function (card) {
  card.style.cursor = "pointer";

  card.addEventListener("click", function (event) {
    // Don't trigger when the heart is clicked
    if (event.target.closest(".wishlist")) {
      return;
    }

    const productName = card.querySelector(".top-h3")?.textContent.trim();

    if (productName) {
      alert("You selected: " + productName);
    }
  });
});
