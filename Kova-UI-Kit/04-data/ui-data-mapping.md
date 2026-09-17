# Which field feeds which pixel

Read this next to the mockups. Nothing in the screens is invented — every value on screen traces
back to a field below. If you can't find the field, you're looking at static copy.

---

## Product card — appears on home, listing, search, detail, account

| On screen | Field | Formatting |
|---|---|---|
| Image | `thumbnail` | 1:1, `object-fit: cover` |
| Discount tag | `discountPercentage` | `-{Math.round(d)}%`, shown only when `d >= 5` |
| Category kicker | `category` | uppercase, mono, +0.10em |
| Title | `title` | clamp to 2 lines |
| Stars | `rating` | filled to `Math.round(rating)` |
| Rating value | `rating` | mono, 2 decimals |
| Price | `price` and `discountPercentage` | `price * (1 - d/100)`, 2 decimals, `$` prefix |
| Was-price | `price` | struck through, only when `d >= 5` |
| Stock label | `stock` | see the three-way rule in `components.md` |

The discounted price is **computed in the UI** here, because `/products` doesn't send one. This is
the one place you do the maths yourself — see the cart section for the opposite rule.

---

## Product detail — `04-product-detail.png`

| On screen | Field |
|---|---|
| Breadcrumb | `category` → `title` |
| Gallery main + thumbnails | `images[]`, falling back to `thumbnail` |
| Kicker | `category` · `brand` (brand is missing on some products — hide the separator, don't print "undefined") |
| Title | `title` |
| Stars, value, review count | `rating`, `reviews.length` |
| SKU | `sku` |
| Price, was-price, save tag | `price`, `discountPercentage` |
| Stock line | `stock`, `availabilityStatus` |
| Description | `description` |
| Minimum order callout | `minimumOrderQuantity` |
| Add-to-cart button total | `discountedPrice × quantity` |
| Three info panels | `shippingInformation`, `warrantyInformation`, `returnPolicy` |
| Specifications table | `brand`, `weight`, `dimensions` (w × h × d), `meta.barcode`, `tags[]` |
| Reviews | `reviews[]` → `reviewerName`, `rating`, `comment`, `date` |
| You might also like | `GET /products/category/{category}`, excluding the current `id` |

The quantity stepper starts at `minimumOrderQuantity`, not 1. Product 1 has a minimum of 24, which
is why the mockup shows "Add to cart — $222.48" rather than the unit price.

Reviewer avatars are not in the API. Use the images in `02-assets/avatars/`, or generate one from
the name via `https://dummyjson.com/icon/{name}/128`.

---

## Cart — `05-cart.png`

Cart line items use the **cart** shape, not the product shape:

| On screen | Field |
|---|---|
| Thumbnail | `products[].thumbnail` |
| Title | `products[].title` |
| Unit price | `products[].price` |
| Discount tag | `products[].discountPercentage` |
| Quantity | `products[].quantity` |
| Line total | `products[].discountedTotal` |
| "3 products · 27 items" | `totalProducts`, `totalQuantity` |
| Subtotal | `total` |
| Product discounts | `total - discountedTotal` |
| Order total | `discountedTotal` |

**Do not recompute the totals here.** The API already sent `total` and `discountedTotal`; deriving
them again in the UI is how the summary drifts out of sync with the rows. The note printed in the
mockup's summary panel says exactly this, and it's there on purpose.

Shipping shows "Free" — that is static copy, there is no shipping field.

---

## Listing and search — `02` and `03`

| On screen | Source |
|---|---|
| Page heading | category `name` from `/products/categories` |
| "Showing 1–12 of 194" | `skip + 1`, `skip + products.length`, `total` |
| Category chips / sidebar | `/products/categories` |
| Pagination page count | `Math.ceil(total / limit)` |
| Active filter chips | your own filter state |
| Result count on search | `total` from `/products/search?q=` |

Price, rating, and availability filters run client-side over the fetched page. Say so in your README.

---

## Login — `07-login.png`

| On screen | Field |
|---|---|
| Username / password inputs | request body `username`, `password` |
| Error message | 400 response `message` |
| After success | store `accessToken`; header account icon switches to the user's `image` |

---

## Account and order history — `08-account-orders.png`

| On screen | Field |
|---|---|
| Name | `firstName` + `lastName` |
| Handle and email | `username`, `email` |
| Avatar | `image` |
| Order rows | `GET /carts/user/{id}` → each cart's `id`, `totalProducts`, `discountedTotal` |
| Status pill | Not in the API — static, or derive it from cart `id` for demo purposes |

Order dates aren't in the cart response either. If you show one, say in your README that it's
fabricated. Being explicit about what's mocked is part of the exercise.

---

## Empty-ish fields to guard against

- `brand` is missing on many products (groceries especially)
- `images` can hold a single item
- `reviews` is always present but the ratings inside it don't average to the top-level `rating`
- long titles wrap to two lines and will break a card with a fixed height
- `price` ranges from `$1.29` to `$32,999.99` — the price cell has to survive both
