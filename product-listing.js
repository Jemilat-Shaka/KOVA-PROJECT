document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     VARIABLES
  ========================= */

  const searchInput = document.querySelector('input[type="search"]');
  const sortSelect = document.querySelector(".select");

  const categoryFilters = document.querySelectorAll(".category-filter");
  const priceRange = document.getElementById("priceRange");

  const clearButton = document.querySelector(".filter-heading button");
  const showMoreButton = document.getElementById("showMoreCats");

  const filterButton = document.querySelector(
    ".sort-filter button:first-of-type",
  );

  const wishlistButtons = document.querySelectorAll(".wishlist");

  const cartIcon = document.querySelector(".user-cart img:last-child");

  const productRows = document.querySelectorAll(".top-r-div");

  const paginationButtons = document.querySelectorAll(".pagination button");

  /* =========================
     SEARCH
  ========================= */

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchValue = searchInput.value.toLowerCase().trim();

      productRows.forEach(function (row) {
        const products = row.querySelectorAll(".top-r-img");

        products.forEach(function (product) {
          const productText = product.textContent.toLowerCase();

          if (productText.includes(searchValue)) {
            product.style.display = "";
          } else {
            product.style.display = "none";
          }
        });
      });
    });
  }

  /* =========================
     SORT PRODUCTS
  ========================= */

  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      const selectedOption = sortSelect.value;

      const products = [];

      productRows.forEach(function (row) {
        row.querySelectorAll(".top-r-img").forEach(function (product) {
          products.push(product);
        });
      });

      products.sort(function (a, b) {
        const priceA = getPrice(a);
        const priceB = getPrice(b);

        if (selectedOption === "price-low") {
          return priceA - priceB;
        }

        if (selectedOption === "price-high") {
          return priceB - priceA;
        }

        if (selectedOption === "rating") {
          return getRating(b) - getRating(a);
        }

        if (selectedOption === "discount") {
          return getDiscount(b) - getDiscount(a);
        }

        return 0;
      });

      /* Put the sorted products back into rows */

      productRows.forEach(function (row) {
        row.innerHTML = "";
      });

      products.forEach(function (product, index) {
        const rowNumber = Math.floor(index / 3);

        if (productRows[rowNumber]) {
          productRows[rowNumber].appendChild(product);
        }
      });
    });
  }

  /* =========================
     GET PRODUCT PRICE
  ========================= */

  function getPrice(product) {
    const priceElement = product.querySelector(".current-price");

    if (!priceElement) {
      return 0;
    }

    const priceText = priceElement.textContent
      .replace("$", "")
      .replace(",", "")
      .trim();

    return parseFloat(priceText) || 0;
  }

  /* =========================
     GET PRODUCT RATING
  ========================= */

  function getRating(product) {
    const ratingText = product.querySelector(".top-mainn")?.textContent.trim();

    if (!ratingText) {
      return 0;
    }

    const numbers = ratingText.match(/\d+(\.\d+)?/);

    return numbers ? parseFloat(numbers[0]) : 0;
  }

  /* =========================
     GET DISCOUNT
  ========================= */

  function getDiscount(product) {
    const discountElement = product.querySelector(".main-div2-span1");

    if (!discountElement) {
      return 0;
    }

    const discountText = discountElement.textContent.match(/\d+/);

    return discountText ? parseInt(discountText[0]) : 0;
  }

  /* =========================
     CATEGORY FILTER
  ========================= */

  categoryFilters.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
      const selectedCategories = [];

      categoryFilters.forEach(function (item) {
        if (item.checked) {
          selectedCategories.push(item.value.toLowerCase());
        }
      });

      productRows.forEach(function (row) {
        row.querySelectorAll(".top-r-img").forEach(function (product) {
          const category = product
            .querySelector(".browsee")
            ?.textContent.toLowerCase()
            .trim();

          if (
            selectedCategories.length === 0 ||
            selectedCategories.includes(category)
          ) {
            product.style.display = "";
          } else {
            product.style.display = "none";
          }
        });
      });
    });
  });

  /* =========================
     PRICE FILTER
  ========================= */

  if (priceRange) {
    priceRange.addEventListener("input", function () {
      const maximumPrice = Number(priceRange.value);

      productRows.forEach(function (row) {
        row.querySelectorAll(".top-r-img").forEach(function (product) {
          const productPrice = getPrice(product);

          if (productPrice <= maximumPrice) {
            product.style.display = "";
          } else {
            product.style.display = "none";
          }
        });
      });
    });
  }

  /* =========================
     CLEAR ALL FILTERS
  ========================= */

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      categoryFilters.forEach(function (checkbox) {
        checkbox.checked = false;
      });

      if (priceRange) {
        priceRange.value = priceRange.max;
      }

      if (searchInput) {
        searchInput.value = "";
      }

      productRows.forEach(function (row) {
        row.querySelectorAll(".top-r-img").forEach(function (product) {
          product.style.display = "";
        });
      });
    });
  }

  /* =========================
     SHOW MORE CATEGORIES
  ========================= */

  if (showMoreButton) {
    showMoreButton.addEventListener("click", function () {
      const hiddenCategories = document.querySelectorAll(
        ".filter-group .hidden-category",
      );

      hiddenCategories.forEach(function (category) {
        category.style.display = "block";
      });

      showMoreButton.textContent = "Show less";

      showMoreButton.classList.toggle("showing-more");
    });
  }

  /* =========================
     WISHLIST
  ========================= */

  wishlistButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.textContent.trim() === "♡") {
        button.textContent = "♥";

        button.style.color = "red";
      } else {
        button.textContent = "♡";

        button.style.color = "black";
      }
    });
  });

  /* =========================
     CART BUTTON
  ========================= */

  if (cartIcon) {
    cartIcon.addEventListener("click", function () {
      alert("Your cart is currently empty.");
    });
  }

  /* =========================
     PAGINATION
  ========================= */

  paginationButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const buttonText = button.textContent.trim();

      if (buttonText === "‹" || buttonText === "›") {
        return;
      }

      paginationButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");
    });
  });

  /* =========================
     FILTER BUTTON
  ========================= */

  if (filterButton) {
    filterButton.addEventListener("click", function () {
      const filters = document.querySelector(".filters");

      if (filters) {
        if (filters.style.display === "block") {
          filters.style.display = "none";
        } else {
          filters.style.display = "block";
        }
      }
    });
  }
});

const showMoreButton = document.getElementById("showMoreCats");
const extraCategories = document.querySelector(".extra-categories");

showMoreButton.addEventListener("click", function () {
  if (
    extraCategories.style.display === "none" ||
    extraCategories.style.display === ""
  ) {
    extraCategories.style.display = "block";
    showMoreButton.textContent = "Show less";
  } else {
    extraCategories.style.display = "none";
    showMoreButton.textContent = "Show 18 more";
  }
});
