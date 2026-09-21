# Screen inventory

What each screen must contain to count as built. Reference PNG in brackets.

---

## Core — required

### 1. Home  [`desktop/01-home.png`, `mobile/01-home.png`]
Header with search and cart count. Hero with headline, two buttons, and three trust items. A
featured product panel with a corner tag. Category chip strip (first 14 + "+10 more"). Two product
grids: "Top rated right now" (`?sortBy=rating&order=desc`) and "On sale" (highest
`discountPercentage`). Footer with four link columns.

### 2. Product listing  [`desktop/02-product-listing.png`, `mobile/02-product-listing.png`]
Breadcrumb. Page title from the category. Result count line. Sort control, filter button, view
toggle. Left sidebar: category checkboxes, price range, rating, availability. Active filter chips
above the grid. 3-column grid (2 on mobile). Numbered pagination with the query string printed
below. Mobile collapses filters behind a button and uses "Load more".

### 3. Search results  [`desktop/03-search-results.png`]
Query echoed in the heading. Result count from `total`. Related-term chips. 4-column grid.
Must handle zero results — see the states section.

### 4. Product detail  [`desktop/04-product-detail.png`, `mobile/03-product-detail.png`]
Gallery with thumbnails (carousel with dots on mobile). Category · brand kicker. Title, stars,
rating, review count, SKU. Price block with was-price and save tag. Stock line. Description.
Minimum-order callout. Quantity stepper + add to cart showing the line total. Buy-now. Three info
panels from shipping, warranty, return fields. Specifications table. Reviews. Related products.
Mobile keeps the add-to-cart in a sticky bottom bar.

### 5. Cart  [`desktop/05-cart.png`, `mobile/04-cart.png`]
Line items with thumbnail, category, title, unit price, was-price, discount tag, stock, quantity
stepper, remove, and line total. Product and item counts in the subheading. Sticky summary panel:
subtotal, discounts, shipping, total, checkout button. Continue-shopping and clear-cart links.

---

## Stretch

### 6. Checkout  [`desktop/06-checkout.png`]
Three-step indicator. Address form with focus state shown. Delivery method radios. Order summary
with product thumbnails, quantity badges, and the same totals as the cart.

### 7. Login  [`desktop/07-login.png`, `mobile/05-login.png`]
Split layout: form left, dark panel right. Username, password with reveal toggle, remember me,
forgot link. Test credentials callout. The mobile mockup shows the error state — build both.

### 8. Account and orders  [`desktop/08-account-orders.png`]
Profile header with avatar, name, handle, email, sign out. Left nav with active marker. Order
history table from `/carts/user/{id}`. Wishlist grid.

---

## States — required, all four

| State | PNG | Trigger |
|---|---|---|
| Loading | `states/01-loading-skeletons.png` | Any fetch in flight. Test with `&delay=2000`. |
| Empty cart | `states/02-empty-cart.png` | Cart has no items. Header badge hidden, not "0". |
| No results | `states/03-no-search-results.png` | `products: []` from a search |
| API error | `states/04-api-error.png` | Non-2xx or network failure. Retry must refetch. |
